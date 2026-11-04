// Supabase 연결은 이 파일 하나에서만 만듭니다. 다른 곳에서는 `supabase` 를 import 해서 쓰세요.
// 담당: PM
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// .env 가 없으면 false. 이때 앱은 목업(가짜) 데이터로 동작합니다.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured && __DEV__) {
  console.warn('[supabase] .env 설정이 없어 목업 모드로 실행됩니다. frontend/README.md 를 확인하세요.');
}

export const supabase = createClient(supabaseUrl ?? 'http://localhost:54321', supabaseKey ?? 'missing-key', {
  auth: {
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 앱이 화면에 있을 때만 로그인 토큰을 자동 갱신합니다.
if (isSupabaseConfigured && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
