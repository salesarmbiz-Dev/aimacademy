export interface SOPMachineState {
  currentView: 'template' | 'wizard' | 'preview' | 'export';
  selectedTemplate: string | null;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  generatedSOP: GeneratedSOP | null;
  isGenerating: boolean;
  editingSectionIndex: number | null;
  editedSections: Record<number, string>;
  startTime: number | null;
  qualityScore: number;
}

export interface GeneratedSOP {
  title: string;
  version: string;
  effectiveDate: string;
  department: string;
  owner: string;
  sections: SOPSection[];
}

export interface SOPSection {
  title: string;
  content?: string;
  steps?: SOPStep[];
  items?: string[];
}

export interface SOPStep {
  step: string;
  tasks: string[];
  responsible: string;
  timeline: string;
}

export interface QualityBreakdown {
  completeness: number;
  clarity: number;
  measurability: number;
  practicality: number;
}
