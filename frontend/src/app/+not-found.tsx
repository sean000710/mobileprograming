// 갈 수 없는 주소로 오면 로그인 상태에 맞는 곳으로 보내줍니다.
// (예: 로그아웃하면 홈(/)이 보호돼서 사라지는데, 그때 로그인 화면으로 이동시켜요)
import { Redirect } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';

export default function NotFound() {
  const { isSignedIn } = useAuth();
  return <Redirect href={isSignedIn ? '/' : '/login'} />;
}
