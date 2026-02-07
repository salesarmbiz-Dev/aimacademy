import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageLoader } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isGuestMode, loading, user } = useAuth();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking onboarding status:', error);
          setOnboardingCompleted(true); // Default to completed to avoid blocking
        } else {
          setOnboardingCompleted(data?.onboarding_completed ?? false);
        }
      } catch (err) {
        console.error('Failed to check onboarding:', err);
        setOnboardingCompleted(true);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    if (isAuthenticated && user) {
      checkOnboardingStatus();
    } else {
      setCheckingOnboarding(false);
    }
  }, [isAuthenticated, user]);

  if (loading || checkingOnboarding) {
    return <PageLoader />;
  }

  // Allow access if authenticated OR in guest mode
  if (!isAuthenticated && !isGuestMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user needs onboarding (not guest, authenticated, and not completed)
  if (
    isAuthenticated && 
    !isGuestMode && 
    onboardingCompleted === false &&
    !location.pathname.startsWith('/onboarding') &&
    !location.pathname.startsWith('/assessment')
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
