// 게시글 한 개의 모양
export interface Post {
  id: string;
  authorId: string; // Supabase 익명 사용자 ID
  nickname: string; // 익명 사용자 ID 앞 4자리로 만든 표시명
  content: string; // 글 내용
  createdAt: string; // 작성 시각 (ISO 문자열, 예: 2026-11-04T05:30:00.000Z)
  likeCount: number; // 좋아요 수 (집계 값만 노출, 누가 눌렀는지는 앱에 표시하지 않음)
  commentCount: number; // 댓글 수
  likedByMe: boolean; // 내가 좋아요를 눌렀는지
  likePending: boolean; // 내 좋아요 변경을 저장하는 중인지
}

// 댓글 한 개의 모양
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  nickname: string; // 익명 사용자 ID 앞 4자리로 만든 표시명
  content: string;
  createdAt: string;
}

// 신고 사유 (supabase/schema.sql 의 post_reports.reason check 와 같아야 해요)
export type ReportReason = 'spam' | 'abuse' | 'sexual' | 'illegal' | 'other';
