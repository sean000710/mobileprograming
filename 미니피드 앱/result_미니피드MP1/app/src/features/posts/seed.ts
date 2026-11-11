// 앱을 켰을 때 처음 보이는 예시 글 (서버가 없어서 코드 안에 넣어 둔 데이터)
import { minutesAgo } from '@/shared/lib/time';
import type { Post } from './types';

export const SEED_POSTS: Post[] = [
  {
    id: 'seed-1',
    nickname: '박지민',
    content: '체육대회 언제 시작하나요?? 다들 몇 시까지 오는지 아시는 분?',
    createdAt: minutesAgo(5),
  },
  {
    id: 'seed-2',
    nickname: '김도윤',
    content:
      '급식 오늘 진짜 맛있었다 ㅋㅋ\n돈까스 나온 날은 항상 줄이 길어요 ㅠㅠ 근데 오늘은 그만큼 기다릴 가치가 있었어요! 소스도 진짜 맛있고 양도 많아서 완전 만족스러웠어요. 다음 급식도 기대되네요 🍽️',
    createdAt: minutesAgo(32),
  },
  {
    id: 'seed-3',
    nickname: '최서연',
    content: '동아리 신입 부원 모집합니다. 관심 있으신 분들 댓글 남겨주세요!',
    createdAt: minutesAgo(120),
  },
  {
    id: 'seed-4',
    nickname: '이하은',
    content: '학교 축제 사진 공유해요 📸 인생네컷 찍은 사람 사진 좀 보내주세요',
    createdAt: minutesAgo(180),
  },
];
