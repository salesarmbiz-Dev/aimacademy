import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTracking } from '@/contexts/TrackingContext';

// Pages to exclude from tracking
const EXCLUDED_PATHS = ['/login', '/register'];
const DEBOUNCE_MS = 500;

export const usePageTracking = () => {
  const location = useLocation();
  const { trackPageView } = useTracking();
  const previousPathRef = useRef<string | null>(null);
  const previousPageStartTimeRef = useRef<number>(Date.now());
  const lastTrackTimeRef = useRef<number>(0);

  useEffect(() => {
    const currentPath = location.pathname;
    const now = Date.now();

    // Skip excluded paths
    if (EXCLUDED_PATHS.includes(currentPath)) {
      return;
    }

    // Debounce rapid navigation
    if (now - lastTrackTimeRef.current < DEBOUNCE_MS) {
      return;
    }

    // Calculate time on previous page
    let timeOnPreviousPage: number | undefined;
    if (previousPathRef.current && previousPathRef.current !== currentPath) {
      timeOnPreviousPage = Math.floor((now - previousPageStartTimeRef.current) / 1000);
    }

    // Track the page view
    trackPageView(currentPath, timeOnPreviousPage);

    // Update refs
    previousPathRef.current = currentPath;
    previousPageStartTimeRef.current = now;
    lastTrackTimeRef.current = now;
  }, [location.pathname, trackPageView]);
};

export default usePageTracking;
