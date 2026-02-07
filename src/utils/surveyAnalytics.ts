import type { SurveyResponse } from '@/components/survey/types';

/**
 * Calculate NPS score from survey responses
 * NPS = ((Promoters - Detractors) / Total) * 100
 * Returns: -100 to +100
 */
export const calculateNPS = (responses: SurveyResponse[]): number => {
  if (responses.length === 0) return 0;

  let promoters = 0;
  let detractors = 0;

  responses.forEach(r => {
    if (r.nps_score >= 9) promoters++;
    else if (r.nps_score <= 6) detractors++;
  });

  return Math.round(((promoters - detractors) / responses.length) * 100);
};

/**
 * Calculate average ratings per dimension
 */
export const calculateAverageRatings = (responses: SurveyResponse[]): {
  fun: number;
  difficulty: number;
  usefulness: number;
} => {
  if (responses.length === 0) {
    return { fun: 0, difficulty: 0, usefulness: 0 };
  }

  const totals = responses.reduce(
    (acc, r) => ({
      fun: acc.fun + (r.rating_fun || 0),
      difficulty: acc.difficulty + (r.rating_difficulty || 0),
      usefulness: acc.usefulness + (r.rating_usefulness || 0),
    }),
    { fun: 0, difficulty: 0, usefulness: 0 }
  );

  return {
    fun: Math.round((totals.fun / responses.length) * 10) / 10,
    difficulty: Math.round((totals.difficulty / responses.length) * 10) / 10,
    usefulness: Math.round((totals.usefulness / responses.length) * 10) / 10,
  };
};

/**
 * Get continue interest distribution
 */
export const getContinueInterest = (responses: SurveyResponse[]): {
  yes: number;
  maybe: number;
  no: number;
  yesPercent: number;
  maybePercent: number;
  noPercent: number;
} => {
  const counts = responses.reduce(
    (acc, r) => {
      if (r.continue_interest === 'yes') acc.yes++;
      else if (r.continue_interest === 'maybe') acc.maybe++;
      else if (r.continue_interest === 'no') acc.no++;
      return acc;
    },
    { yes: 0, maybe: 0, no: 0 }
  );

  const total = responses.length || 1;

  return {
    ...counts,
    yesPercent: Math.round((counts.yes / total) * 100),
    maybePercent: Math.round((counts.maybe / total) * 100),
    noPercent: Math.round((counts.no / total) * 100),
  };
};

/**
 * Get all open-ended feedback
 */
export const getAllFeedback = (responses: SurveyResponse[]): string[] => {
  return responses
    .map(r => r.open_feedback)
    .filter((f): f is string => !!f && f.trim().length > 0);
};

/**
 * Get NPS followup comments grouped by category
 */
export const getNpsFollowups = (responses: SurveyResponse[]): {
  promoter: string[];
  passive: string[];
  detractor: string[];
} => {
  return responses.reduce(
    (acc, r) => {
      if (!r.nps_followup) return acc;
      
      if (r.nps_score >= 9) acc.promoter.push(r.nps_followup);
      else if (r.nps_score >= 7) acc.passive.push(r.nps_followup);
      else acc.detractor.push(r.nps_followup);
      
      return acc;
    },
    { promoter: [] as string[], passive: [] as string[], detractor: [] as string[] }
  );
};

/**
 * Get desired topics from responses
 */
export const getDesiredTopics = (responses: SurveyResponse[]): string[] => {
  return responses
    .map(r => r.desired_topics)
    .filter((t): t is string => !!t && t.trim().length > 0);
};
