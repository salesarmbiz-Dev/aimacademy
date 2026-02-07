import React from 'react';
import { usePageTracking } from '@/hooks/usePageTracking';

/**
 * Component that tracks page views across the app.
 * Must be placed inside BrowserRouter and TrackingProvider.
 */
export const PageTracker: React.FC = () => {
  usePageTracking();
  return null;
};

export default PageTracker;
