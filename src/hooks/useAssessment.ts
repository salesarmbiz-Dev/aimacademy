import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useActivityTracker } from './useActivityTracker';
import { useTracking } from '@/contexts/TrackingContext';

export interface AssessmentQuestion {
  id: string;
  skill_category: string;
  difficulty: string;
  question_type: string;
  question_text: string;
  question_text_th: string;
  options: Array<{
    id: string;
    text: string;
    text_th: string;
  }>;
  correct_answer: string;
  explanation: string | null;
  explanation_th: string | null;
  points: number;
}

export interface AssessmentAttempt {
  id: string;
  assessment_type: 'pre_test' | 'post_test';
  started_at: string;
  completed_at: string | null;
  total_questions: number;
  correct_answers: number;
  total_score: number;
  max_score: number;
  percentage: number;
  time_spent_seconds: number;
  skill_scores: Record<string, { correct: number; total: number; percentage: number }>;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface SkillScore {
  skill: string;
  label: string;
  correct: number;
  total: number;
  percentage: number;
}

const SKILL_LABELS: Record<string, string> = {
  prompt_structure: 'โครงสร้าง Prompt',
  context_setting: 'การกำหนดบริบท',
  output_control: 'การควบคุมผลลัพธ์',
  role_assignment: 'การกำหนดบทบาท',
  chain_prompting: 'การเชื่อมต่อ Prompt',
  error_detection: 'การจับผิด Prompt',
};

export const useAssessment = () => {
  const { user, isGuestMode } = useAuth();
  const { trackActivity } = useActivityTracker();
  const { trackEvent } = useTracking();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [preTestAttempt, setPreTestAttempt] = useState<AssessmentAttempt | null>(null);
  const [postTestAttempt, setPostTestAttempt] = useState<AssessmentAttempt | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<AssessmentAttempt | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [challengesCompleted, setChallengesCompleted] = useState(0);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching questions:', error);
      return;
    }

    // Parse options from JSONB
    const parsed = (data || []).map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    })) as AssessmentQuestion[];

    setQuestions(parsed);
  }, []);

  // Fetch user's attempts
  const fetchAttempts = useCallback(async () => {
    if (!user || isGuestMode) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('assessment_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching attempts:', error);
      setLoading(false);
      return;
    }

    const attempts = (data || []).map(d => ({
      ...d,
      skill_scores: (typeof d.skill_scores === 'object' && d.skill_scores !== null 
        ? d.skill_scores 
        : {}) as Record<string, { correct: number; total: number; percentage: number }>,
    })) as AssessmentAttempt[];
    setPreTestAttempt(attempts.find(a => a.assessment_type === 'pre_test') || null);
    setPostTestAttempt(attempts.find(a => a.assessment_type === 'post_test') || null);
    setLoading(false);
  }, [user, isGuestMode]);

  // Fetch challenges completed count (mock for now, would come from activity log)
  const fetchChallengesCompleted = useCallback(async () => {
    if (!user || isGuestMode) return;

    const { count } = await supabase
      .from('user_activity_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('activity_type', 'challenge_complete');

    setChallengesCompleted(count || 0);
  }, [user, isGuestMode]);

  useEffect(() => {
    fetchQuestions();
    fetchAttempts();
    fetchChallengesCompleted();
  }, [fetchQuestions, fetchAttempts, fetchChallengesCompleted]);

  // Start a new assessment
  const startAssessment = async (type: 'pre_test' | 'post_test') => {
    if (!user || isGuestMode) return null;

    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 20);
    const maxScore = shuffled.reduce((sum, q) => sum + q.points, 0);

    const { data, error } = await supabase
      .from('assessment_attempts')
      .insert([{
        user_id: user.id,
        assessment_type: type,
        total_questions: shuffled.length,
        max_score: maxScore,
        status: 'in_progress',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error starting assessment:', error);
      return null;
    }

    const attempt = {
      ...data,
      skill_scores: (typeof data.skill_scores === 'object' && data.skill_scores !== null 
        ? data.skill_scores 
        : {}) as Record<string, { correct: number; total: number; percentage: number }>,
    } as AssessmentAttempt;
    setCurrentAttempt(attempt);
    setUserAnswers({});
    
    trackActivity('assessment_start', { type, attemptId: attempt.id });
    trackEvent('assessment_start', { type, attempt_id: attempt.id });
    
    return { attempt, questions: shuffled };
  };

  // Submit an answer
  const submitAnswer = async (
    attemptId: string,
    questionId: string,
    answer: string,
    correctAnswer: string,
    timeSpent: number
  ) => {
    if (!user || isGuestMode) return;

    const isCorrect = answer === correctAnswer;

    await supabase.from('assessment_answers').insert([{
      attempt_id: attemptId,
      question_id: questionId,
      user_answer: answer,
      is_correct: isCorrect,
      time_spent_seconds: timeSpent,
    }]);

    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // Complete the assessment
  const completeAssessment = async (
    attemptId: string,
    answers: Array<{ questionId: string; answer: string; question: AssessmentQuestion }>,
    totalTimeSeconds: number
  ) => {
    if (!user || isGuestMode) return null;

    // Calculate scores
    const skillScores: Record<string, { correct: number; total: number; percentage: number }> = {};
    let correctAnswers = 0;
    let totalScore = 0;

    for (const { answer, question } of answers) {
      const skill = question.skill_category;
      if (!skillScores[skill]) {
        skillScores[skill] = { correct: 0, total: 0, percentage: 0 };
      }
      skillScores[skill].total += 1;

      if (answer === question.correct_answer) {
        correctAnswers += 1;
        totalScore += question.points;
        skillScores[skill].correct += 1;
      }
    }

    // Calculate percentages
    for (const skill of Object.keys(skillScores)) {
      const s = skillScores[skill];
      s.percentage = Math.round((s.correct / s.total) * 100);
    }

    const percentage = Math.round((correctAnswers / answers.length) * 100);

    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({
        completed_at: new Date().toISOString(),
        correct_answers: correctAnswers,
        total_score: totalScore,
        percentage,
        time_spent_seconds: totalTimeSeconds,
        skill_scores: skillScores,
        status: 'completed',
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) {
      console.error('Error completing assessment:', error);
      return null;
    }

    const completedAttempt = {
      ...data,
      skill_scores: (typeof data.skill_scores === 'object' && data.skill_scores !== null 
        ? data.skill_scores 
        : {}) as Record<string, { correct: number; total: number; percentage: number }>,
    } as AssessmentAttempt;
    
    if (completedAttempt.assessment_type === 'pre_test') {
      setPreTestAttempt(completedAttempt);
    } else {
      setPostTestAttempt(completedAttempt);
    }
    
    setCurrentAttempt(null);
    
    trackActivity('assessment_complete', { 
      type: completedAttempt.assessment_type, 
      score: percentage,
      attemptId 
    });
    
    // Track with new tracking context
    trackEvent('assessment_complete', {
      type: completedAttempt.assessment_type,
      total_score: totalScore,
      percentage,
      time_seconds: totalTimeSeconds,
      competencies: JSON.parse(JSON.stringify(skillScores)),
    });

    return completedAttempt;
  };

  // Get skill scores with labels
  const getSkillScores = (attempt: AssessmentAttempt | null): SkillScore[] => {
    if (!attempt?.skill_scores) return [];

    return Object.entries(attempt.skill_scores).map(([skill, data]) => ({
      skill,
      label: SKILL_LABELS[skill] || skill,
      ...data,
    }));
  };

  // Check if post-test is unlocked
  const isPostTestUnlocked = preTestAttempt !== null && challengesCompleted >= 20;

  return {
    loading,
    questions,
    preTestAttempt,
    postTestAttempt,
    currentAttempt,
    userAnswers,
    challengesCompleted,
    isPostTestUnlocked,
    startAssessment,
    submitAnswer,
    completeAssessment,
    getSkillScores,
    SKILL_LABELS,
    refetch: () => {
      fetchAttempts();
      fetchChallengesCompleted();
    },
  };
};
