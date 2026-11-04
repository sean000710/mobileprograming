// 서버가 아직 없을 때 쓰는 목업 도우미.
// 각 기능의 api.ts 에서 Supabase 연결 전까지 가짜 데이터를 돌려줄 때 사용합니다.

// 실제 네트워크처럼 약간 기다렸다가 응답합니다.
export function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
