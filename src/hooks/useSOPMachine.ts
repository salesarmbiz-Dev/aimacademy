import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTracking } from '@/contexts/TrackingContext';
import { toast } from '@/hooks/use-toast';
import type { SOPMachineState, GeneratedSOP, QualityBreakdown } from '@/components/games/sop-machine/types';
import { generateSOPFromInputs } from '@/data/sopTemplates';
import { getQuestionsForTemplate } from '@/data/sopQuestions';

export function useSOPMachine() {
  const { user, isGuestMode } = useAuth();
  const { trackEvent, trackGameStart, trackGameEnd } = useTracking();
  const hasTrackedStart = useRef(false);
  
  const [state, setState] = useState<SOPMachineState>({
    currentView: 'template',
    selectedTemplate: null,
    currentQuestionIndex: 0,
    answers: {},
    generatedSOP: null,
    isGenerating: false,
    editingSectionIndex: null,
    editedSections: {},
    startTime: null,
    qualityScore: 0,
  });

  const selectTemplate = useCallback((templateId: string) => {
    setState(prev => ({
      ...prev,
      selectedTemplate: templateId,
    }));
  }, []);

  const startWizard = useCallback(() => {
    // Track game start when wizard begins
    if (!hasTrackedStart.current) {
      trackGameStart('sop-machine', { template_type: state.selectedTemplate });
      hasTrackedStart.current = true;
    }
    
    setState(prev => ({
      ...prev,
      currentView: 'wizard',
      currentQuestionIndex: 0,
      answers: {},
      startTime: Date.now(),
    }));
  }, [state.selectedTemplate, trackGameStart]);

  const updateAnswer = useCallback((questionId: string, value: any) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value,
      },
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    const questions = getQuestionsForTemplate(state.selectedTemplate || '');
    if (state.currentQuestionIndex < questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    } else {
      // Generate SOP
      generateSOP();
    }
  }, [state.selectedTemplate, state.currentQuestionIndex]);

  const prevQuestion = useCallback(() => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  }, [state.currentQuestionIndex]);

  const generateSOP = useCallback(() => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      currentView: 'preview',
    }));

    // Simulate AI generation delay
    setTimeout(() => {
      const sop = generateSOPFromInputs(state.selectedTemplate || '', state.answers);
      const qualityScore = calculateQualityScore(sop, state.answers);

      setState(prev => ({
        ...prev,
        isGenerating: false,
        generatedSOP: sop,
        qualityScore,
      }));
    }, 3500);
  }, [state.selectedTemplate, state.answers]);

  const calculateQualityScore = (sop: GeneratedSOP, answers: Record<string, any>): number => {
    let score = 70; // Base score

    // Add points for completeness
    if (answers.companyName && answers.companyName.length > 5) score += 5;
    if (answers.responsiblePerson) score += 5;
    if (answers.tools && answers.tools.length > 0) score += 5;
    if (answers.problems && answers.problems.length > 20) score += 5;
    if (sop.sections.length >= 5) score += 5;

    // Cap at 100
    return Math.min(score, 95);
  };

  const getQualityBreakdown = useCallback((): QualityBreakdown => {
    const sop = state.generatedSOP;
    const answers = state.answers;

    return {
      completeness: sop?.sections.length ? Math.min(10, Math.floor(sop.sections.length * 1.5)) : 5,
      clarity: answers.responsiblePerson ? 8 : 6,
      measurability: sop?.sections.some(s => s.steps) ? 9 : 6,
      practicality: answers.tools?.length > 0 ? 8 : 5,
    };
  }, [state.generatedSOP, state.answers]);

  const startEditSection = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      editingSectionIndex: index,
    }));
  }, []);

  const saveEditSection = useCallback((index: number, content: string) => {
    setState(prev => ({
      ...prev,
      editedSections: {
        ...prev.editedSections,
        [index]: content,
      },
      editingSectionIndex: null,
    }));
  }, []);

  const cancelEdit = useCallback(() => {
    setState(prev => ({
      ...prev,
      editingSectionIndex: null,
    }));
  }, []);

  const finishAndExport = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentView: 'export',
    }));
  }, []);

  const saveSession = useCallback(async () => {
    if (!user || !state.generatedSOP) return;

    const timeSpent = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
    const xpEarned = Math.floor(state.qualityScore * 1.5);

    // Track game completion
    trackGameEnd('sop-machine', state.qualityScore, xpEarned, {
      template_type: state.selectedTemplate,
      time_seconds: timeSpent,
      sections_count: state.generatedSOP.sections.length,
    });

    // Track asset creation
    trackEvent('asset_created', {
      asset_type: 'sop',
      game_source: 'sop-machine',
      quality_score: state.qualityScore,
      template_type: state.selectedTemplate,
    });

    try {
      // Save session
      await supabase.from('sop_machine_sessions').insert({
        user_id: user.id,
        template_type: state.selectedTemplate || '',
        context_inputs: state.answers,
        quality_score: state.qualityScore,
        time_seconds: timeSpent,
        xp_earned: xpEarned,
      });

      // Update game progress
      const { data: existingProgress } = await supabase
        .from('user_game_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_id', 'sop-machine')
        .single();

      if (existingProgress) {
        await supabase
          .from('user_game_progress')
          .update({
            best_score: Math.max(existingProgress.best_score || 0, state.qualityScore),
            attempts: (existingProgress.attempts || 0) + 1,
            xp_earned: (existingProgress.xp_earned || 0) + xpEarned,
            total_time_seconds: (existingProgress.total_time_seconds || 0) + timeSpent,
            status: 'completed',
            last_played_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);
      } else {
        await supabase.from('user_game_progress').insert({
          user_id: user.id,
          game_id: 'sop-machine',
          best_score: state.qualityScore,
          attempts: 1,
          xp_earned: xpEarned,
          total_time_seconds: timeSpent,
          status: 'completed',
          first_played_at: new Date().toISOString(),
          last_played_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, [user, state, trackGameEnd, trackEvent]);

  const saveToLibrary = useCallback(async () => {
    if (!user || !state.generatedSOP) {
      if (isGuestMode) {
        toast({
          title: 'โหมดทดลอง',
          description: 'สมัครสมาชิกเพื่อบันทึก SOP เข้า Library',
          variant: 'default',
        });
        return;
      }
      return;
    }

    try {
      await supabase.from('sop_assets').insert([
        {
          user_id: user.id,
          template_type: state.selectedTemplate || '',
          title: state.generatedSOP.title,
          company_name: state.answers.companyName || '',
          department: state.generatedSOP.department,
          content_json: JSON.parse(JSON.stringify(state.generatedSOP)),
          quality_score: state.qualityScore,
          status: 'completed',
        },
      ]);

      toast({
        title: '✅ บันทึกสำเร็จ',
        description: 'SOP ถูกบันทึกเข้า AI Asset Library แล้ว',
      });
    } catch (error) {
      console.error('Failed to save to library:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกได้ กรุณาลองใหม่',
        variant: 'destructive',
      });
    }
  }, [user, isGuestMode, state]);

  const downloadPDF = useCallback(() => {
    if (!state.generatedSOP) return;

    // Create printable HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${state.generatedSOP.title}</title>
        <style>
          body { font-family: 'Noto Sans Thai', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #03588C; border-bottom: 2px solid #F27405; padding-bottom: 10px; }
          h2 { color: #03588C; margin-top: 30px; }
          .header-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .step { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .step-header { display: flex; justify-content: space-between; align-items: center; }
          .badge { background: #F27405; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
          .checklist { list-style: none; padding: 0; }
          .checklist li { padding: 5px 0; }
          .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${state.generatedSOP.title}</h1>
        <div class="header-info">
          <div><strong>Version:</strong> ${state.generatedSOP.version}</div>
          <div><strong>Date:</strong> ${state.generatedSOP.effectiveDate}</div>
          <div><strong>Department:</strong> ${state.generatedSOP.department}</div>
          <div><strong>Owner:</strong> ${state.generatedSOP.owner}</div>
        </div>
        ${state.generatedSOP.sections.map(section => `
          <h2>${section.title}</h2>
          ${section.content ? `<p>${section.content.replace(/\n/g, '<br>')}</p>` : ''}
          ${section.steps ? section.steps.map(step => `
            <div class="step">
              <div class="step-header">
                <strong>${step.step}</strong>
                <span class="badge">${step.responsible} • ${step.timeline}</span>
              </div>
              <ul>
                ${step.tasks.map(task => `<li>${task}</li>`).join('')}
              </ul>
            </div>
          `).join('') : ''}
          ${section.items ? `<ul class="checklist">${section.items.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
        `).join('')}
        <div class="footer">
          สร้างโดย AIM Academy SOP Machine | Quality Score: ${state.qualityScore}/100
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }, [state.generatedSOP, state.qualityScore]);

  const reset = useCallback(() => {
    hasTrackedStart.current = false;
    setState({
      currentView: 'template',
      selectedTemplate: null,
      currentQuestionIndex: 0,
      answers: {},
      generatedSOP: null,
      isGenerating: false,
      editingSectionIndex: null,
      editedSections: {},
      startTime: null,
      qualityScore: 0,
    });
  }, []);

  const getXPEarned = useCallback(() => {
    return Math.floor(state.qualityScore * 1.5);
  }, [state.qualityScore]);

  const getStepsCount = useCallback(() => {
    if (!state.generatedSOP) return 0;
    return state.generatedSOP.sections.reduce((acc, section) => {
      if (section.steps) return acc + section.steps.length;
      return acc;
    }, 0);
  }, [state.generatedSOP]);

  return {
    state,
    selectTemplate,
    startWizard,
    updateAnswer,
    nextQuestion,
    prevQuestion,
    startEditSection,
    saveEditSection,
    cancelEdit,
    finishAndExport,
    saveSession,
    saveToLibrary,
    downloadPDF,
    reset,
    getQualityBreakdown,
    getXPEarned,
    getStepsCount,
  };
}
