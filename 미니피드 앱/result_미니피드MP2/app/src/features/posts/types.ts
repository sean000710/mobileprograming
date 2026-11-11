// 게시글 한 개의 모양
export interface Post {
  id: string;
  authorId: string; // Supabase 익명 사용자 ID
  nickname: string; // 익명 사용자 ID 앞 4자리로 만든 표시명
  content: string; // 글 내용
  createdAt: string; // 작성 시각 (ISO 문자열, 예: 2026-11-04T05:30:00.000Z)
}
