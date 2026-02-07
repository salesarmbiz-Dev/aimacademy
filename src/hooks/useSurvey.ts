import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTracking } from '@/contexts/TrackingContext';
import type { SurveyResponse, TriggerContext, SurveyFormData } from '@/components/survey/types';

interface UseSurveyReturn {
  loading: boolean;
  submitting: boolean;
  hasSubmitted: (triggerContext: TriggerContext) => Promise<boolean>;
  submitSurvey: (formData: SurveyFormData, triggerContext: TriggerContext) => Promise<boolean>;
  checkSet1Eligibility: () => Promise<boolean>;
}

// SET 1 game IDs
const SET1_GAME_IDS = ['spot', 'lego', 'debugger'];
const MIN_SCORE_FOR_SURVEY = 70;

export const useSurvey = (): UseSurveyReturn => {
  const { user, isGuestMode } = useAuth();
  const { trackEvent } = useTracking();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check if user has already submitted survey for this trigger
  const hasSubmitted = useCallback(async (triggerContext: TriggerContext): Promise<boolean> => {
    if (!user || isGuestMode) return false;

    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('user_id', user.id)
        .eq('trigger_context', triggerContext)
        .limit(1);

      if (error) {
        console.error('Error checking survey submission:', error);
        return false;
      }

      return (data?.length || 0) > 0;
    } catch (err) {
      console.error('Error checking survey:', err);
      return false;
    }
  }, [user, isGuestMode]);

  // Check if user is eligible for SET 1 survey (all 3 games completed with 70%+)
  const checkSet1Eligibility = useCallback(async (): Promise<boolean> => {
    if (!user || isGuestMode) return false;

    try {
      setLoading(true);

      // Check if already submitted
      const alreadySubmitted = await hasSubmitted('set1_complete');
      if (alreadySubmitted) return false;

      // Check game progress
      const { data: progressData, error } = await supabase
        .from('user_game_progress')
        .select('game_id, best_score, status')
        .eq('user_id', user.id)
        .in('game_id', SET1_GAME_IDS);

      if (error) {
        console.error('Error checking game progress:', error);
        return false;
      }

      if (!progressData || progressData.length < SET1_GAME_IDS.length) {
        return false;
      }

      // Check all games have 70%+ score
      const allCompleted = SET1_GAME_IDS.every(gameId => {
        const progress = progressData.find(p => p.game_id === gameId);
        return progress && 
               progress.status === 'completed' && 
               (progress.best_score || 0) >= MIN_SCORE_FOR_SURVEY;
      });

      return allCompleted;
    } catch (err) {
      console.error('Error checking SET 1 eligibility:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, isGuestMode, hasSubmitted]);

  // Submit survey response
  const submitSurvey = useCallback(async (
    formData: SurveyFormData, 
    triggerContext: TriggerContext
  ): Promise<boolean> => {
    if (!user || isGuestMode) return false;
    if (formData.npsScore === null || !formData.continueInterest) return false;

    try {
      setSubmitting(true);

      const response: Omit<SurveyResponse, 'id' | 'submitted_at'> = {
        user_id: user.id,
        trigger_context: triggerContext,
        nps_score: formData.npsScore,
        nps_followup: formData.npsFollowup || undefined,
        rating_fun: formData.ratingFun,
        rating_difficulty: formData.ratingDifficulty,
        rating_usefulness: formData.ratingUsefulness,
        open_feedback: formData.openFeedback || undefined,
        continue_interest: formData.continueInterest,
        desired_topics: formData.desiredTopics || undefined,
        xp_earned: 25,
      };

      const { error } = await supabase
        .from('survey_responses')
        .insert([response]);

      if (error) {
        console.error('Error submitting survey:', error);
        return false;
      }

      // Track event
      trackEvent('survey_submitted', {
        trigger: triggerContext,
        nps_score: formData.npsScore,
        rating_fun: formData.ratingFun,
        rating_difficulty: formData.ratingDifficulty,
        rating_usefulness: formData.ratingUsefulness,
        has_feedback: !!formData.openFeedback,
        continue_interest: formData.continueInterest,
      });

      return true;
    } catch (err) {
      console.error('Error submitting survey:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [user, isGuestMode, trackEvent]);

  return {
    loading,
    submitting,
    hasSubmitted,
    submitSurvey,
    checkSet1Eligibility,
  };
};
