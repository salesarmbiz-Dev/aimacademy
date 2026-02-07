import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/useOnboarding';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { ProfileStep } from '@/components/onboarding/ProfileStep';
import { GoalsStep } from '@/components/onboarding/GoalsStep';
import { AssessmentIntroStep } from '@/components/onboarding/AssessmentIntroStep';
import { ReadyStep } from '@/components/onboarding/ReadyStep';
import { PageLoader } from '@/components/LoadingSpinner';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    data,
    loading,
    saving,
    updateData,
    nextStep,
    prevStep,
    saveProfile,
    completeOnboarding,
    skipOnboarding,
  } = useOnboarding();

  const handleSkipAll = async () => {
    const success = await skipOnboarding();
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleProfileNext = async () => {
    await saveProfile();
    nextStep();
  };

  const handleGoalsNext = async () => {
    await saveProfile();
    nextStep();
  };

  const handleComplete = async () => {
    await completeOnboarding();
  };

  if (loading) {
    return <PageLoader />;
  }

  const progressValue = (currentStep / 5) * 100;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-oxford via-oxford/95 to-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress 
          value={progressValue} 
          className="h-1 rounded-none bg-oxford/20 [&>div]:bg-tennessee [&>div]:transition-all [&>div]:duration-500"
        />
      </div>

      {/* Header */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-40">
        <span className="text-xs text-rackley">
          ขั้นตอน {currentStep}/5
        </span>
        {currentStep < 5 && (
          <button
            onClick={handleSkipAll}
            disabled={saving}
            className="text-sm text-rackley underline hover:text-oxford transition-colors"
          >
            ข้ามทั้งหมด →
          </button>
        )}
      </div>

      {/* Content */}
      <div className="min-h-screen flex items-center justify-center pt-16 pb-8">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={currentStep}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            {currentStep === 1 && (
              <WelcomeStep onNext={nextStep} />
            )}
            
            {currentStep === 2 && (
              <ProfileStep
                data={data}
                onUpdate={updateData}
                onNext={handleProfileNext}
                onBack={prevStep}
              />
            )}
            
            {currentStep === 3 && (
              <GoalsStep
                data={data}
                onUpdate={updateData}
                onNext={handleGoalsNext}
                onBack={prevStep}
              />
            )}
            
            {currentStep === 4 && (
              <AssessmentIntroStep
                data={data}
                onUpdate={updateData}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            
            {currentStep === 5 && (
              <ReadyStep
                data={data}
                onComplete={handleComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
