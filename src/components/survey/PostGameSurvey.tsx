import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSurvey } from '@/hooks/useSurvey';
import NPSStep from './NPSStep';
import RatingsStep from './RatingsStep';
import FeedbackStep from './FeedbackStep';
import InterestStep from './InterestStep';
import SuccessStep from './SuccessStep';
import type { TriggerContext, SurveyFormData, ContinueInterest } from './types';
import { initialFormData } from './types';
import { cn } from '@/lib/utils';

interface PostGameSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  triggerContext: TriggerContext;
}

const TOTAL_STEPS = 4;

const PostGameSurvey: React.FC<PostGameSurveyProps> = ({
  isOpen,
  onClose,
  triggerContext,
}) => {
  const isMobile = useIsMobile();
  const { submitSurvey, submitting } = useSurvey();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SurveyFormData>(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData(initialFormData);
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    const success = await submitSurvey(formData, triggerContext);
    if (success) {
      setShowSuccess(true);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  // Validation for next button
  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.npsScore !== null;
      case 2:
        return formData.ratingFun > 0 && formData.ratingDifficulty > 0 && formData.ratingUsefulness > 0;
      case 3:
        return true; // Feedback is optional
      case 4:
        return formData.continueInterest !== null;
      default:
        return false;
    }
  };

  // Form update handlers
  const handleNpsChange = (score: number) => {
    setFormData(prev => ({ ...prev, npsScore: score }));
  };

  const handleNpsFollowupChange = (text: string) => {
    setFormData(prev => ({ ...prev, npsFollowup: text }));
  };

  const handleRatingChange = (type: 'fun' | 'difficulty' | 'usefulness', value: number) => {
    const key = `rating${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof SurveyFormData;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFeedbackChange = (text: string) => {
    setFormData(prev => ({ ...prev, openFeedback: text }));
  };

  const handleInterestChange = (interest: ContinueInterest) => {
    setFormData(prev => ({ ...prev, continueInterest: interest }));
  };

  const handleTopicsChange = (topics: string) => {
    setFormData(prev => ({ ...prev, desiredTopics: topics }));
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = isMobile
    ? {
        hidden: { y: '100%' },
        visible: { y: 0 },
      }
    : {
        hidden: { scale: 0.95, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
      };

  const stepVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              'relative z-10 bg-background shadow-2xl overflow-hidden',
              isMobile
                ? 'w-full rounded-t-3xl max-h-[90vh]'
                : 'w-full max-w-lg rounded-3xl mx-4'
            )}
            variants={modalVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-20"
              aria-label="Close survey"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Progress Dots */}
            {!showSuccess && (
              <div className="flex justify-center gap-2 pt-6 pb-2">
                {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      i + 1 <= step ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div
                    key="success"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <SuccessStep xpEarned={25} onClose={handleClose} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    {step === 1 && (
                      <NPSStep
                        npsScore={formData.npsScore}
                        npsFollowup={formData.npsFollowup}
                        onNpsChange={handleNpsChange}
                        onFollowupChange={handleNpsFollowupChange}
                        showCongrats={triggerContext === 'set1_complete'}
                      />
                    )}
                    {step === 2 && (
                      <RatingsStep
                        ratingFun={formData.ratingFun}
                        ratingDifficulty={formData.ratingDifficulty}
                        ratingUsefulness={formData.ratingUsefulness}
                        onRatingChange={handleRatingChange}
                      />
                    )}
                    {step === 3 && (
                      <FeedbackStep
                        openFeedback={formData.openFeedback}
                        onFeedbackChange={handleFeedbackChange}
                      />
                    )}
                    {step === 4 && (
                      <InterestStep
                        continueInterest={formData.continueInterest}
                        desiredTopics={formData.desiredTopics}
                        onInterestChange={handleInterestChange}
                        onTopicsChange={handleTopicsChange}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with action button */}
            {!showSuccess && (
              <div className="p-4 border-t border-border">
                {step < TOTAL_STEPS ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="w-full py-3 text-base font-semibold"
                  >
                    ถัดไป →
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || submitting}
                    className="w-full py-3 text-base font-semibold"
                  >
                    {submitting ? 'กำลังส่ง...' : 'ส่ง Feedback →'}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostGameSurvey;
