// 로그인 상태를 앱 전체에 알려주는 곳. 담당: PM
// 화면에서는 `const { isSignedIn, signOut } = useAuth();` 로 사용합니다.
import type { Session } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/shared/lib/supabase';

type AuthContextValue = {
  session: Session | null;
  isSignedIn: boolean;
  isLoading: boolean;
  // 개발용 둘러보기: Supabase 없이 로그인된 것처럼 화면을 볼 수 있어요.
  isDevMode: boolean;
  enterDevMode: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setIsLoading(false));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isSignedIn: Boolean(session) || isDevMode,
      isLoading,
      isDevMode,
      enterDevMode: () => setIsDevMode(true),
      signOut: async () => {
        setIsDevMode(false);
        if (isSupabaseConfigured) await supabase.auth.signOut();
      },
    }),
    [session, isLoading, isDevMode],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 는 AuthProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
