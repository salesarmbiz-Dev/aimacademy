import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAssessment, AssessmentQuestion } from '@/hooks/useAssessment';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const SKILL_LABELS: Record<string, string> = {
  prompt_structure: 'โครงสร้าง Prompt',
  context_setting: 'การกำหนดบริบท',
  output_control: 'การควบคุมผลลัพธ์',
  role_assignment: 'การกำหนดบทบาท',
  chain_prompting: 'การเชื่อมต่อ Prompt',
  error_detection: 'การจับผิด Prompt',
};

const AssessmentTest: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testType = (searchParams.get('type') as 'pre_test' | 'post_test') || 'pre_test';
  
  const { user, isGuestMode } = useAuth();
  const { questions: allQuestions, startAssessment, submitAnswer, completeAssessment } = useAssessment();
  
  const [isStarting, setIsStarting] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [testQuestions, setTestQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer
  useEffect(() => {
    if (!isStarting && attemptId) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarting, attemptId]);

  // Initialize test
  const initTest = useCallback(async () => {
    if (!user || isGuestMode) {
      navigate('/assessment');
      return;
    }

    const result = await startAssessment(testType);
    if (result) {
      setAttemptId(result.attempt.id);
      setTestQuestions(result.questions);
      setIsStarting(false);
      setQuestionStartTime(0);
    } else {
      navigate('/assessment');
    }
  }, [user, isGuestMode, testType, startAssessment, navigate]);

  useEffect(() => {
    initTest();
  }, [initTest]);

  const currentQuestion = testQuestions[currentIndex];
  const progress = testQuestions.length > 0 ? ((currentIndex + 1) / testQuestions.length) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleNext = async () => {
    if (!selectedAnswer || !currentQuestion || !attemptId) return;

    // Save answer
    const timeSpent = elapsedSeconds - questionStartTime;
    await submitAnswer(
      attemptId,
      currentQuestion.id,
      selectedAnswer,
      currentQuestion.correct_answer,
      timeSpent
    );

    setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedAnswer }));

    if (currentIndex < testQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(answers[testQuestions[currentIndex + 1]?.id] || null);
      setQuestionStartTime(elapsedSeconds);
    } else {
      setShowSubmitDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedAnswer(answers[testQuestions[currentIndex - 1]?.id] || null);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    
    setIsSubmitting(true);

    // Include the last answer
    const allAnswers = { ...answers };
    if (selectedAnswer && currentQuestion) {
      allAnswers[currentQuestion.id] = selectedAnswer;
    }

    const answersArray = testQuestions.map(q => ({
      questionId: q.id,
      answer: allAnswers[q.id] || '',
      question: q,
    }));

    await completeAssessment(attemptId, answersArray, elapsedSeconds);
    
    setIsSubmitting(false);
    navigate(`/assessment/results?type=${testType}`);
  };

  if (isStarting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-turquoise/30 border-t-turquoise rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">กำลังเตรียมข้อสอบ...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-foreground font-semibold">
              ข้อ {currentIndex + 1}/{testQuestions.length}
            </span>
            <div className="flex items-center gap-2 text-rackley">
              <Clock className="w-4 h-4" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>
          <div className="px-3 py-1 bg-turquoise/10 border border-turquoise/30 rounded-full">
            <span className="text-turquoise text-sm">
              {SKILL_LABELS[currentQuestion.skill_category]}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress 
            value={progress} 
            className="h-2 bg-oxford-blue"
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-turquoise/20 rounded-2xl p-6 md:p-8 mb-6"
          >
            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-8 leading-relaxed">
              {currentQuestion.question_text_th}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectAnswer(option.id)}
                    className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-turquoise bg-turquoise/10'
                        : 'border-rackley/30 bg-transparent hover:border-turquoise/50 hover:bg-turquoise/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-turquoise bg-turquoise'
                          : 'border-rackley'
                      }`}>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-oxford-blue" />
                        )}
                      </div>
                      <div>
                        <span className="text-rackley font-medium mr-2">
                          {option.id.toUpperCase()})
                        </span>
                        <span className={isSelected ? 'text-foreground' : 'text-rackley'}>
                          {option.text_th}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-rackley hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            ข้อก่อนหน้า
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="bg-primary hover:bg-primary/90"
          >
            {currentIndex === testQuestions.length - 1 ? 'ส่งคำตอบ' : 'ข้อถัดไป'}
            {currentIndex < testQuestions.length - 1 && (
              <ChevronRight className="w-5 h-5 ml-1" />
            )}
          </Button>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 p-4 bg-card/50 rounded-xl">
          <p className="text-rackley text-sm mb-3">คลิกเพื่อข้ามไปข้อที่ต้องการ:</p>
          <div className="flex flex-wrap gap-2">
            {testQuestions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setSelectedAnswer(answers[q.id] || null);
                  }}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    isCurrent
                      ? 'bg-primary text-white'
                      : isAnswered
                      ? 'bg-turquoise/20 text-turquoise border border-turquoise/30'
                      : 'bg-rackley/20 text-rackley hover:bg-rackley/30'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent className="bg-card border-turquoise/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              ยืนยันส่งคำตอบ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-rackley">
              คุณตอบไปแล้ว {Object.keys(answers).length + (selectedAnswer ? 1 : 0)}/{testQuestions.length} ข้อ
              <br />
              เวลาที่ใช้: {formatTime(elapsedSeconds)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-rackley/30 text-rackley">
              ยกเลิก
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำตอบ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssessmentTest;
