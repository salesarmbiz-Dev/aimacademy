import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sopTemplates } from '@/data/sopTemplates';
import { getQuestionsForTemplate } from '@/data/sopQuestions';
import { useSOPMachine } from '@/hooks/useSOPMachine';
import { TemplateCard } from '@/components/games/sop-machine/TemplateCard';
import { WizardStep } from '@/components/games/sop-machine/WizardStep';
import { SOPPreview } from '@/components/games/sop-machine/SOPPreview';
import { QualityScore } from '@/components/games/sop-machine/QualityScore';
import { GeneratingLoader } from '@/components/games/sop-machine/GeneratingLoader';
import { ExportView } from '@/components/games/sop-machine/ExportView';

const SOPMachine: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useSOPMachine();

  const viewLabels: Record<string, string> = {
    template: 'ขั้นตอน 1/4',
    wizard: 'ขั้นตอน 2/4',
    preview: 'ขั้นตอน 3/4',
    export: 'ขั้นตอน 4/4',
  };

  // Save session when reaching export view
  useEffect(() => {
    if (state.currentView === 'export') {
      saveSession();
    }
  }, [state.currentView, saveSession]);

  const questions = state.selectedTemplate
    ? getQuestionsForTemplate(state.selectedTemplate)
    : [];

  const currentQuestion = questions[state.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/games"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับ Game Hub
          </Link>
          <h1 className="font-bold text-foreground">SOP Machine</h1>
          <span className="text-sm text-muted-foreground">
            {viewLabels[state.currentView]}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* View 1: Template Selection */}
        {state.currentView === 'template' && (
          <div className="max-w-5xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                SOP Machine
              </h1>
              <p className="text-muted-foreground mb-4">
                สร้าง SOP ระดับมืออาชีพ — ได้ deliverable จริงกลับไปใช้งาน
              </p>
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                💰 มูลค่าเทียบเท่า Consultant ฿150-300K
              </span>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {sopTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={state.selectedTemplate === template.id}
                  onClick={() => selectTemplate(template.id)}
                />
              ))}
            </div>

            {/* CTA */}
            <Button
              onClick={startWizard}
              disabled={!state.selectedTemplate}
              className="w-full max-w-md mx-auto block py-6 text-lg"
            >
              เลือก Template นี้ →
            </Button>
          </div>
        )}

        {/* View 2: Context Input Wizard */}
        {state.currentView === 'wizard' && currentQuestion && (
          <div className="max-w-xl mx-auto">
            <WizardStep
              question={currentQuestion}
              value={state.answers[currentQuestion.id]}
              onChange={(value) => updateAnswer(currentQuestion.id, value)}
              onNext={nextQuestion}
              onBack={prevQuestion}
              isFirst={state.currentQuestionIndex === 0}
              isLast={state.currentQuestionIndex === questions.length - 1}
              currentStep={state.currentQuestionIndex}
              totalSteps={questions.length}
            />
          </div>
        )}

        {/* View 3: SOP Preview + Edit */}
        {state.currentView === 'preview' && (
          <>
            {state.isGenerating ? (
              <GeneratingLoader />
            ) : state.generatedSOP ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* SOP Document */}
                <div className="lg:col-span-2">
                  <SOPPreview
                    sop={state.generatedSOP}
                    editedSections={state.editedSections}
                    editingSectionIndex={state.editingSectionIndex}
                    onStartEdit={startEditSection}
                    onSaveEdit={saveEditSection}
                    onCancelEdit={cancelEdit}
                  />

                  {/* Bottom CTA */}
                  <div className="mt-6">
                    <Button
                      onClick={finishAndExport}
                      className="w-full py-6 text-lg"
                    >
                      บันทึก & ดาวน์โหลด →
                    </Button>
                  </div>
                </div>

                {/* Quality Score Sidebar (Desktop) */}
                <div className="hidden lg:block">
                  <div className="sticky top-24">
                    <QualityScore
                      score={state.qualityScore}
                      breakdown={getQualityBreakdown()}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Quality Score Bottom Sheet (Mobile) */}
            {!state.isGenerating && state.generatedSOP && (
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">คุณภาพ SOP</p>
                    <p className="text-2xl font-bold text-primary">{state.qualityScore}/100</p>
                  </div>
                  <Button onClick={finishAndExport}>
                    บันทึก →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* View 4: Export */}
        {state.currentView === 'export' && (
          <ExportView
            qualityScore={state.qualityScore}
            sectionsCount={state.generatedSOP?.sections.length || 0}
            stepsCount={getStepsCount()}
            xpEarned={getXPEarned()}
            onDownloadPDF={downloadPDF}
            onSaveToLibrary={saveToLibrary}
            onCreateAnother={reset}
            onBackToHub={() => navigate('/games')}
          />
        )}
      </div>
    </div>
  );
};

export default SOPMachine;
