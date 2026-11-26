// 앱을 켰을 때 처음 보이는 예시 글 (서버가 없어서 코드 안에 넣어 둔 데이터)
import { minutesAgo } from '@/shared/lib/time';
import type { Post } from './types';

export const SEED_POSTS: Post[] = [
  {
    id: 'seed-1',
    nickname: '체육대회러',
    content: '체육대회 언제 시작하나요?? 다들 몇 시까지 오는지 아시는 분?',
    createdAt: minutesAgo(5),
  },
  {
    id: 'seed-2',
    nickname: '급식러버',
    content:
      '급식 오늘 진짜 맛있었다 ㅋㅋ\n돈까스 나온 날은 항상 줄이 길어요 ㅠㅠ 근데 오늘은 그만큼 기다릴 가치가 있었어요! 소스도 진짜 맛있고 양도 많아서 완전 만족스러웠어요. 다음 급식도 기대되네요 🍽️',
    createdAt: minutesAgo(32),
  },
  {
    id: 'seed-3',
    nickname: '동아리장',
    content: '동아리 신입 부원 모집합니다. 관심 있으신 분들 댓글 남겨주세요!',
    createdAt: minutesAgo(120),
  },
  {
    id: 'seed-4',
    nickname: '축제요정',
    content: '학교 축제 사진 공유해요 📸 인생네컷 찍은 사람 사진 좀 보내주세요',
    createdAt: minutesAgo(180),
  },
  {
    id: 'seed-5',
    nickname: '책갈피',
    content: '독서 모임에서 다음에 읽을 책을 고르는 중이에요. 짧은 추리 소설 어때요?',
    createdAt: minutesAgo(240),
  },
  {
    id: 'seed-6',
    nickname: '분필고래',
    content: '칠판 한쪽에 오늘의 수학 퀴즈를 적어 뒀어요. 힌트는 대칭입니다!',
    createdAt: minutesAgo(300),
  },
  {
    id: 'seed-7',
    nickname: '셔틀콕',
    content: '점심시간 배드민턴은 복식으로 하니까 기다리는 시간이 줄었어요.',
    createdAt: minutesAgo(480),
  },
  {
    id: 'seed-8',
    nickname: '새싹관찰대',
    content: '창가에 심어 둔 강낭콩에서 드디어 첫 잎이 나왔어요.',
    createdAt: minutesAgo(1440),
  },
  {
    id: 'seed-9',
    nickname: '종이별',
    content: '축제 부스에 걸 종이별을 접고 있어요. 노란색이랑 잘 어울리는 색 추천해 주세요!',
    createdAt: minutesAgo(2880),
  },
  {
    id: 'seed-10',
    nickname: '리듬감자',
    content: '합주 연습을 녹음해서 들어 보니 마지막 박자가 딱 맞았어요!',
    createdAt: minutesAgo(4320),
  },
];
