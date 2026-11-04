// 홈 피드 서버 호출 (C2, C3, C5)
// 지금은 목업 데이터를 돌려줍니다. 함수 이름/반환 모양은 그대로 두고 안쪽만 Supabase 로 바꿔 주세요.
import { delay } from '@/shared/lib/mock';
import { minutesAgo } from '@/shared/lib/time';
import type { BoardType, Notice, PostSummary } from '@/types/models';

// 목업 사진은 디자인(.pen)에 쓰인 샘플 이미지예요. 실제로는 post_images 의 첫 번째 사진을 씁니다.
const PHOTO_FESTIVAL = 'https://images.unsplash.com/photo-1600659762848-65fb19005194?w=200&q=70';
const PHOTO_SPORTS = 'https://images.unsplash.com/photo-1689753859413-0ae96270ca17?w=200&q=70';

export const MOCK_POSTS: PostSummary[] = [
  {
    id: 'p2',
    title: '체육대회 언제 시작하나요??',
    preview: '다들 몇 시까지 오는지 아시는 분?',
    schoolName: '잼타고등학교',
    authorName: '익명',
    isAnonymous: true,
    likeCount: 18,
    commentCount: 4,
    thumbnailUrl: PHOTO_SPORTS,
    createdAt: minutesAgo(5),
  },
  {
    id: 'p3',
    title: '급식 오늘 진짜 맛있었다 ㅋㅋ',
    preview: '돈까스 나온 날은 항상 줄이 길어요',
    schoolName: '잼타고등학교',
    authorName: '익명',
    isAnonymous: true,
    likeCount: 42,
    commentCount: 3,
    thumbnailUrl: null,
    createdAt: minutesAgo(32),
  },
  {
    id: 'p4',
    title: '동아리 신입 부원 모집합니다',
    preview: '관심 있으신 분들 댓글 남겨주세요!',
    schoolName: '잼타고등학교',
    authorName: '익명',
    isAnonymous: true,
    likeCount: 9,
    commentCount: 1,
    thumbnailUrl: null,
    createdAt: minutesAgo(120),
  },
  {
    id: 'p1',
    title: '학교 축제 사진 공유해요 📸',
    preview: '인생네컷 찍은 사람 사진 좀 보내주세요',
    schoolName: '잼타고등학교',
    authorName: '익명',
    isAnonymous: true,
    likeCount: 63,
    commentCount: 12,
    thumbnailUrl: PHOTO_FESTIVAL,
    createdAt: minutesAgo(180),
  },
];

// C2. 공지 배너
// TODO(C2): notices 테이블에서 노출 기간(starts_at~ends_at) 안의 공지 1개 가져오기
export async function getNotice(_boardType: BoardType): Promise<Notice | null> {
  await delay();
  return { id: 'n1', title: '9월 정기고사 시간표가 안내되었어요' };
}

// C3. 인기 게시물 (나중에 만들 것)
// TODO(C3): 정렬 기준 결정 (최근 N일 like_count 순 등)
export async function getPopularPosts(_boardType: BoardType): Promise<PostSummary[]> {
  await delay();
  return [...MOCK_POSTS].sort((a, b) => b.likeCount - a.likeCount).slice(0, 3);
}

// C5. 피드 목록 (page 는 0부터)
// TODO(C5): Supabase posts 조회로 교체. 선택한 게시판 + 내 학교 글만 (BOARD-08), status = ACTIVE, 최신순
//   예) supabase.from('posts').select('...').eq('board_id', ...).order('created_at', { ascending: false }).range(from, to)
export async function getPosts(_boardType: BoardType, page = 0): Promise<{ items: PostSummary[]; hasMore: boolean }> {
  await delay();
  return { items: page === 0 ? MOCK_POSTS : [], hasMore: false };
}
