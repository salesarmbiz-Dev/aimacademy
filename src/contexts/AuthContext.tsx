import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AuthState, User, Session } from '@/types';

interface AuthContextValue extends AuthState {
  isGuestMode: boolean;
  guestChallengesRemaining: number;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  startGuestMode: () => void;
  exitGuestMode: () => void;
  decrementGuestChallenges: () => number;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const GUEST_CHALLENGES_LIMIT = 5;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    loading: true,
  });

  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    return localStorage.getItem('aim_guest_mode') === 'true';
  });

  const [guestChallengesRemaining, setGuestChallengesRemaining] = useState<number>(() => {
    const stored = localStorage.getItem('aim_guest_challenges');
    return stored ? parseInt(stored, 10) : GUEST_CHALLENGES_LIMIT;
  });

  useEffect(() => {
    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        };
        setState({
          user,
          session: session as unknown as Session,
          isAuthenticated: true,
          loading: false,
        });
        // Clear guest mode when user logs in
        setIsGuestMode(false);
        localStorage.removeItem('aim_guest_mode');
      } else {
        setState({
          user: null,
          session: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    });

    // THEN check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        };
        setState({
          user,
          session: session as unknown as Session,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error('Sign in error:', error.message);
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ' };
      }
      return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' };
    }
    
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin,
      },
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
      if (error.message.includes('User already registered')) {
        return { error: 'อีเมลนี้ถูกใช้งานแล้ว' };
      }
      if (error.message.includes('Password')) {
        return { error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
      }
      return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' };
    }
    
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsGuestMode(false);
    localStorage.removeItem('aim_guest_mode');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      return { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' };
    }
    
    return { error: null };
  }, []);

  const startGuestMode = useCallback(() => {
    setIsGuestMode(true);
    setGuestChallengesRemaining(GUEST_CHALLENGES_LIMIT);
    localStorage.setItem('aim_guest_mode', 'true');
    localStorage.setItem('aim_guest_challenges', GUEST_CHALLENGES_LIMIT.toString());
  }, []);

  const exitGuestMode = useCallback(() => {
    setIsGuestMode(false);
    localStorage.removeItem('aim_guest_mode');
    localStorage.removeItem('aim_guest_challenges');
  }, []);

  const decrementGuestChallenges = useCallback(() => {
    const newCount = guestChallengesRemaining - 1;
    setGuestChallengesRemaining(newCount);
    localStorage.setItem('aim_guest_challenges', newCount.toString());
    return newCount;
  }, [guestChallengesRemaining]);

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      isGuestMode,
      guestChallengesRemaining,
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      startGuestMode,
      exitGuestMode,
      decrementGuestChallenges,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
