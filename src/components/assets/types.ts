import type { Database } from '@/integrations/supabase/types';

export type AssetCategory = 'prompt' | 'sop' | 'pattern' | 'workflow' | 'template';
export type AssetStatus = 'active' | 'archived';

export interface UserAsset {
  id: string;
  user_id: string;
  category: AssetCategory;
  title: string;
  description: string | null;
  content_json: Record<string, unknown>;
  source_game: string;
  quality_score: number | null;
  tags: string[] | null;
  status: AssetStatus;
  created_at: string;
  updated_at: string;
}

export interface AssetFilters {
  search: string;
  category: AssetCategory | 'all';
  sortBy: 'latest' | 'oldest' | 'score' | 'title';
}

export const categoryConfig: Record<AssetCategory, {
  icon: string;
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
}> = {
  prompt: {
    icon: 'Wand2',
    label: 'Prompts',
    color: 'text-primary',
    borderColor: 'border-l-primary',
    bgColor: 'bg-primary/10',
  },
  sop: {
    icon: 'FileCheck',
    label: 'SOPs',
    color: 'text-accent',
    borderColor: 'border-l-accent',
    bgColor: 'bg-accent/10',
  },
  pattern: {
    icon: 'Eye',
    label: 'Patterns',
    color: 'text-muted-foreground',
    borderColor: 'border-l-muted-foreground',
    bgColor: 'bg-muted',
  },
  workflow: {
    icon: 'GitBranch',
    label: 'Workflows',
    color: 'text-secondary-foreground',
    borderColor: 'border-l-secondary',
    bgColor: 'bg-secondary/10',
  },
  template: {
    icon: 'LayoutTemplate',
    label: 'Templates',
    color: 'text-foreground',
    borderColor: 'border-l-foreground',
    bgColor: 'bg-foreground/10',
  },
};

export const sourceGameLabels: Record<string, string> = {
  'prompt-lego': 'Prompt Lego',
  'sop-machine': 'SOP Machine',
  'spot-the-difference': 'Spot the Difference',
  'debugger': 'Prompt Debugger',
};
