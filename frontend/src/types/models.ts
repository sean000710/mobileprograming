// 앱 전체에서 쓰는 데이터 모양 (docs/DB_SCHEMA.md 기준).
// 담당: DB 담당. 필드를 바꾸면 사용하는 화면이 같이 깨지므로 팀에 공지 후 변경해 주세요.
// id 는 Supabase 기본값(uuid)에 맞춰 string 으로 둡니다.

export type BoardType = 'SCHOOL' | 'REGION' | 'PARENT';
export type UserRole = 'STUDENT' | 'PARENT' | 'TEACHER';

export interface School {
  id: string;
  name: string;
  region: string;
  address?: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  schoolId: string;
  schoolName: string;
  grade: number | null;
  role: UserRole;
  studentVerified: boolean;
  parentVerified: boolean;
  anonymousDefault: boolean;
}

export interface Notice {
  id: string;
  title: string;
}

// 피드 카드에 보이는 요약 정보
export interface PostSummary {
  id: string;
  title: string;
  preview: string;
  schoolName: string;
  authorName: string; // 익명 글이면 서버에서 '익명'으로 내려줘야 해요 (MY-08)
  isAnonymous: boolean;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string | null;
  createdAt: string; // ISO 문자열
}

export interface PostDetail extends PostSummary {
  content: string;
  imageUrls: string[];
  likedByMe: boolean;
  isMine: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  isAnonymous: boolean;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export type ReportTargetType = 'POST' | 'COMMENT' | 'MESSAGE';

export const REPORT_REASONS = ['욕설/비방', '스팸/광고', '부적절한 사진', '허위 정보', '기타'] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export type MessageBox = 'received' | 'sent';

export interface Conversation {
  id: string;
  partnerName: string;
  partnerSchool: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  createdAt: string;
  mine: boolean;
}

export interface Activity {
  id: string;
  type: 'POST' | 'COMMENT';
  postId: string;
  text: string;
  createdAt: string;
}
