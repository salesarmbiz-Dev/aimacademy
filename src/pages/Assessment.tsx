import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AssessmentHub from '@/components/assessment/AssessmentHub';
import AssessmentTest from '@/components/assessment/AssessmentTest';
import AssessmentResults from '@/components/assessment/AssessmentResults';

const Assessment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');
  const type = searchParams.get('type');

  // Route to appropriate component based on URL params
  if (view === 'test' || window.location.pathname.includes('/test')) {
    return <AssessmentTest />;
  }

  if (view === 'results' || window.location.pathname.includes('/results')) {
    return <AssessmentResults />;
  }

  return <AssessmentHub />;
};

export default Assessment;
