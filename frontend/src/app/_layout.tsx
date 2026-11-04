// 앱의 최상위 틀: 폰트 로딩, 전역 상태(로그인/게시판), 화면 이동 규칙. 담당: PM
//
// 화면 이동 규칙 (Stack.Protected):
//   - 로그인 안 됨 → (auth) 그룹(로그인/회원가입)만 들어갈 수 있음
//   - 로그인 됨   → 나머지 화면. 로그인 직후에는 목록 맨 위의 board-select 로 이동
import { Jua_400Regular } from '@expo-google-fonts/jua';
import {
  NotoSansKR_400Regular,
  NotoSansKR_500Medium,
  NotoSansKR_600SemiBold,
  NotoSansKR_700Bold,
} from '@expo-google-fonts/noto-sans-kr';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';
import { BoardProvider } from '@/features/board/BoardProvider';
import { colors } from '@/shared/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Jua_400Regular,
    NotoSansKR_400Regular,
    NotoSansKR_500Medium,
    NotoSansKR_600SemiBold,
    NotoSansKR_700Bold,
  });

  return (
    <AuthProvider>
      <BoardProvider>
        <StatusBar style="dark" />
        <RootNavigator fontsReady={fontsLoaded || Boolean(fontError)} />
      </BoardProvider>
    </AuthProvider>
  );
}

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { isSignedIn, isLoading } = useAuth();
  const ready = fontsReady && !isLoading;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="board-select" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="post/[id]" />
        <Stack.Screen name="post/write" options={{ presentation: 'modal' }} />
        <Stack.Screen name="chat/[id]" />
      </Stack.Protected>
    </Stack>
  );
}
