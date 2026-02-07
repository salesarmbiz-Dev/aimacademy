import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { SpotProvider } from '@/contexts/SpotContext';
import { TrackingProvider } from '@/contexts/TrackingContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AppLayout } from '@/components/AppLayout';
import { PageLoader } from '@/components/LoadingSpinner';
import { PageTracker } from '@/components/PageTracker';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy loaded pages
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const ForBusiness = lazy(() => import('@/pages/ForBusiness'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const PromptLego = lazy(() => import('@/pages/PromptLego'));
const Challenges = lazy(() => import('@/pages/Challenges'));
const Library = lazy(() => import('@/pages/Library'));
const Profile = lazy(() => import('@/pages/Profile'));
const Leaderboard = lazy(() => import('@/pages/Leaderboard'));
const SpotHub = lazy(() => import('@/pages/spot/SpotHub'));
const SpotGamePlay = lazy(() => import('@/pages/spot/SpotGamePlay'));
const PatternLibrary = lazy(() => import('@/pages/spot/PatternLibrary'));
const SpotLeaderboard = lazy(() => import('@/pages/spot/SpotLeaderboard'));
const Insights = lazy(() => import('@/pages/Insights'));
const Certificates = lazy(() => import('@/pages/Certificates'));
const CertificateView = lazy(() => import('@/pages/CertificateView'));
const VerifyCertificate = lazy(() => import('@/pages/VerifyCertificate'));
const Assessment = lazy(() => import('@/pages/Assessment'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AssetLibrary = lazy(() => import('@/pages/AssetLibrary'));
const GamesHub = lazy(() => import('@/pages/GamesHub'));
const PromptDebugger = lazy(() => import('@/pages/games/PromptDebugger'));
const SOPMachine = lazy(() => import('@/pages/games/SOPMachine'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));

// Team pages
const TeamHub = lazy(() => import('@/pages/team/TeamHub'));
const TeamDashboard = lazy(() => import('@/pages/team/TeamDashboard'));
const TeamInvite = lazy(() => import('@/pages/team/TeamInvite'));
const JoinTeam = lazy(() => import('@/pages/team/JoinTeam'));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
            <TrackingProvider>
              <UserProvider>
                <ProgressProvider>
                  <SpotProvider>
                    <AnimationProvider>
                    <ScrollToTop />
                    <PageTracker />
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route
                          path="/"
                        element={
                          <PublicRoute>
                            <Landing />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/login"
                        element={
                          <PublicRoute>
                            <Login />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/register"
                        element={
                          <PublicRoute>
                            <Register />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/terms"
                        element={
                          <PublicRoute>
                            <Terms />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/privacy"
                        element={
                          <PublicRoute>
                            <Privacy />
                          </PublicRoute>
                        }
                      />
                      <Route
                        path="/for-business"
                        element={
                          <PublicRoute>
                            <ForBusiness />
                          </PublicRoute>
                        }
                      />

                      {/* Onboarding Route - Protected but without layout */}
                      <Route
                        path="/onboarding"
                        element={
                          <ProtectedRoute>
                            <Onboarding />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Routes with App Layout */}
                      <Route
                        element={
                          <ProtectedRoute>
                            <AppLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/games" element={<GamesHub />} />
                        <Route path="/games/debugger" element={<PromptDebugger />} />
                        <Route path="/games/sop-machine" element={<SOPMachine />} />
                        <Route path="/prompt-lego" element={<PromptLego />} />
                        <Route path="/challenges" element={<Challenges />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/assets" element={<AssetLibrary />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/spot" element={<SpotHub />} />
                        <Route path="/spot/play/:categoryId" element={<SpotGamePlay />} />
                        <Route path="/spot/patterns" element={<PatternLibrary />} />
                        <Route path="/spot/leaderboard" element={<SpotLeaderboard />} />
                        <Route path="/insights" element={<Insights />} />
                        <Route path="/certificates" element={<Certificates />} />
                        <Route path="/certificate/:id" element={<CertificateView />} />
                        <Route path="/assessment" element={<Assessment />} />
                        <Route path="/assessment/test" element={<Assessment />} />
                        <Route path="/assessment/results" element={<Assessment />} />
                        
                        {/* Team Routes */}
                        <Route path="/team" element={<TeamHub />} />
                        <Route path="/team/dashboard" element={<TeamDashboard />} />
                        <Route path="/team/invite" element={<TeamInvite />} />
                      </Route>

                      {/* Public Join Team Route */}
                      <Route path="/join/:code" element={<JoinTeam />} />

                      {/* Public Verification Route */}
                      <Route path="/verify/:code" element={<VerifyCertificate />} />

                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </AnimationProvider>
                </SpotProvider>
              </ProgressProvider>
            </UserProvider>
          </TrackingProvider>
        </AuthProvider>
      </ErrorBoundary>
      </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
