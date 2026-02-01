import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserProvider } from '@/contexts/UserContext';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { SpotProvider } from '@/contexts/SpotContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { ScrollToTop } from '@/components/ScrollToTop';
import { AppLayout } from '@/components/AppLayout';
import { PageLoader } from '@/components/LoadingSpinner';

// Lazy loaded pages
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
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
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <ProgressProvider>
              <SpotProvider>
                <AnimationProvider>
                  <ScrollToTop />
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

                      {/* Protected Routes with App Layout */}
                      <Route
                        element={
                          <ProtectedRoute>
                            <AppLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/prompt-lego" element={<PromptLego />} />
                        <Route path="/challenges" element={<Challenges />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/spot" element={<SpotHub />} />
                        <Route path="/spot/play/:categoryId" element={<SpotGamePlay />} />
                        <Route path="/spot/patterns" element={<PatternLibrary />} />
                        <Route path="/spot/leaderboard" element={<SpotLeaderboard />} />
                        <Route path="/insights" element={<Insights />} />
                      </Route>

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </AnimationProvider>
              </SpotProvider>
            </ProgressProvider>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
