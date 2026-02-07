import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/components/onboarding/types';
import { toast } from 'sonner';

const STORAGE_KEY = 'onboarding_step';
const DATA_STORAGE_KEY = 'onboarding_data';

const defaultData: OnboardingData = {
  displayName: '',
  jobTitle: '',
  department: undefined,
  aiExperienceLevel: 0,
  selectedGoals: [],
  preAssessmentSkipped: false,
};

export const useOnboarding = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const savedStep = localStorage.getItem(STORAGE_KEY);
    const savedData = localStorage.getItem(DATA_STORAGE_KEY);
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData({ ...defaultData, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved onboarding data:', e);
      }
    }

    // Check for step parameter in URL (coming back from assessment)
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get('step');
    if (stepParam) {
      setCurrentStep(parseInt(stepParam, 10));
    }

    setLoading(false);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, currentStep.toString());
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    }
  }, [currentStep, data, loading]);

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const saveProfile = useCallback(async () => {
    if (!user) return false;
    
    setSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        display_name: data.displayName,
        job_title: data.jobTitle === 'อื่นๆ' ? data.jobTitleOther : data.jobTitle,
        department: data.department,
        ai_experience_level: data.aiExperienceLevel,
        selected_goals: data.selectedGoals,
        pre_assessment_skipped: data.preAssessmentSkipped,
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, data]);

  const completeOnboarding = useCallback(async () => {
    if (!user) return false;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          display_name: data.displayName,
          job_title: data.jobTitle === 'อื่นๆ' ? data.jobTitleOther : data.jobTitle,
          department: data.department,
          ai_experience_level: data.aiExperienceLevel,
          selected_goals: data.selectedGoals,
          pre_assessment_skipped: data.preAssessmentSkipped,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DATA_STORAGE_KEY);

      // Track completion
      try {
        await supabase.from('activity_events').insert({
          user_id: user.id,
          event_type: 'onboarding_complete',
          event_data: {
            skipped_assessment: data.preAssessmentSkipped,
            ai_experience_level: data.aiExperienceLevel,
            goals: data.selectedGoals,
          },
        });
      } catch (trackError) {
        console.error('Failed to track onboarding:', trackError);
      }

      return true;
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, data]);

  const skipOnboarding = useCallback(async () => {
    if (!user) return false;
    
    setSaving(true);
    try {
      // Extract username from email as default display name
      const emailUsername = user.email?.split('@')[0] || 'User';

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          display_name: data.displayName || emailUsername,
          ai_experience_level: data.aiExperienceLevel || 3,
          selected_goals: data.selectedGoals.length > 0 ? data.selectedGoals : ['prompt-writing'],
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          pre_assessment_skipped: true,
        }, { onConflict: 'user_id' });

      if (error) throw error;

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DATA_STORAGE_KEY);

      // Track skip
      try {
        await supabase.from('activity_events').insert({
          user_id: user.id,
          event_type: 'onboarding_skipped',
          event_data: { skipped_at_step: currentStep },
        });
      } catch (trackError) {
        console.error('Failed to track onboarding skip:', trackError);
      }

      return true;
    } catch (error) {
      console.error('Failed to skip onboarding:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
      return false;
    } finally {
      setSaving(false);
    }
  }, [user, data, currentStep]);

  return {
    currentStep,
    data,
    loading,
    saving,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    saveProfile,
    completeOnboarding,
    skipOnboarding,
  };
};
