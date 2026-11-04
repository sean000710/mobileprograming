// 게시물 상세 / 댓글 서버 호출 (D1~D5)
import { MOCK_POSTS } from '@/features/feed/api';
import { delay } from '@/shared/lib/mock';
import { minutesAgo } from '@/shared/lib/time';
import type { Comment, PostDetail } from '@/types/models';

// D1. 상세 — 없거나 삭제된 글이면 null (D5)
// TODO(D1): Supabase posts + post_images 조회로 교체. 익명 글은 작성자 정보가 응답에 없어야 해요 (MY-08)
export async function getPostDetail(postId: string): Promise<PostDetail | null> {
  await delay();
  const post = MOCK_POSTS.find((p) => p.id === postId);
  if (!post) return null;
  return {
    ...post,
    // .pen 에서는 피드에는 "익명", 상세에는 실명(김도윤)이 보여요. 익명 처리 정책이 정해지면 서버 응답을 따르면 됩니다.
    authorName: postId === 'p3' ? '김도윤' : post.authorName,
    content:
      '돈까스 나온 날은 항상 줄이 길어요 ㅠㅠ 근데 오늘은 그만큼 기다릴 가치가 있었어요! 소스도 진짜 맛있고 양도 많아서 완전 만족스러웠어요. 다음 급식도 기대되네요 🍽️',
    imageUrls: [],
    likedByMe: false,
    isMine: false,
  };
}

// D3. 댓글 목록
// TODO(D3): Supabase comments 조회로 교체 (오래된 순)
export async function getComments(postId: string): Promise<Comment[]> {
  await delay();
  return [
    { id: 'c1', postId, authorName: '박지민', isAnonymous: false, content: '이거 진짜 인정 ㅋㅋㅋ', likeCount: 5, likedByMe: false, createdAt: minutesAgo(28) },
    { id: 'c2', postId, authorName: '최서연', isAnonymous: false, content: '저도 오늘 두 그릇 먹었어요', likeCount: 2, likedByMe: false, createdAt: minutesAgo(20) },
    { id: 'c3', postId, authorName: '김도윤', isAnonymous: false, content: '다음주 메뉴 뭔지 아시는 분?', likeCount: 0, likedByMe: false, createdAt: minutesAgo(10) },
  ];
}

// D3. 댓글 작성 — 부적절 내용이면 서버가 거부 (F3, F2 와 같은 규칙)
// TODO(D3): Supabase comments insert 로 교체
export async function addComment(postId: string, content: string): Promise<Comment> {
  await delay();
  return {
    id: `c${Date.now()}`,
    postId,
    authorName: '나',
    isAnonymous: false,
    content,
    likeCount: 0,
    likedByMe: false,
    createdAt: new Date().toISOString(),
  };
}

// D2. 게시물 좋아요 토글 — 결과로 최신 상태를 돌려줍니다
// TODO(D2): post_likes insert/delete + like_count 갱신 (동시성은 DB 쪽에서 처리, POST-08)
export async function togglePostLike(_postId: string, liked: boolean): Promise<{ liked: boolean }> {
  await delay(150);
  return { liked: !liked };
}

// D4. 댓글 좋아요 토글
// TODO(D4): comment_likes insert/delete
export async function toggleCommentLike(_commentId: string, liked: boolean): Promise<{ liked: boolean }> {
  await delay(150);
  return { liked: !liked };
}
