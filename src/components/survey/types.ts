export type TriggerContext = 'set1_complete' | 'set2_complete' | 'manual';
export type ContinueInterest = 'yes' | 'maybe' | 'no';

export interface SurveyResponse {
  id?: string;
  user_id: string;
  trigger_context: TriggerContext;
  nps_score: number;
  nps_followup?: string;
  rating_fun: number;
  rating_difficulty: number;
  rating_usefulness: number;
  open_feedback?: string;
  continue_interest: ContinueInterest;
  desired_topics?: string;
  xp_earned?: number;
  submitted_at?: string;
}

export interface SurveyFormData {
  npsScore: number | null;
  npsFollowup: string;
  ratingFun: number;
  ratingDifficulty: number;
  ratingUsefulness: number;
  openFeedback: string;
  continueInterest: ContinueInterest | null;
  desiredTopics: string;
}

export const initialFormData: SurveyFormData = {
  npsScore: null,
  npsFollowup: '',
  ratingFun: 0,
  ratingDifficulty: 0,
  ratingUsefulness: 0,
  openFeedback: '',
  continueInterest: null,
  desiredTopics: '',
};

export const quickFeedbackChips = [
  'อยากมีเกมเพิ่ม',
  'อธิบาย bug types ชัดกว่านี้',
  'SOP Machine มีประโยชน์มาก',
  'อยากให้มี tutorial',
  'เล่นสนุกดี',
  'UI ใช้งานง่าย',
];

export const getNpsCategory = (score: number): 'detractor' | 'passive' | 'promoter' => {
  if (score <= 6) return 'detractor';
  if (score <= 8) return 'passive';
  return 'promoter';
};

export const getNpsFollowupQuestion = (score: number): string => {
  const category = getNpsCategory(score);
  switch (category) {
    case 'detractor':
      return 'เราปรับปรุงอะไรได้บ้าง?';
    case 'passive':
      return 'อะไรจะทำให้ให้คะแนนมากกว่านี้?';
    case 'promoter':
      return 'ดีใจที่ชอบ! อะไรที่ประทับใจที่สุด?';
  }
};
