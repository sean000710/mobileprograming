// 게시글 한 개의 모양
export interface Post {
  id: string;
  nickname: string; // 작성자 닉네임
  content: string; // 글 내용
  createdAt: string; // 작성 시각 (ISO 문자열, 예: 2026-11-04T05:30:00.000Z)
}
