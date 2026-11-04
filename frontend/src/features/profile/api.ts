// 마이페이지 서버 호출 (I1~I4). getMyProfile 은 다른 화면(게시판 선택, 홈)에서도 씁니다.
import { delay } from '@/shared/lib/mock';
import { minutesAgo } from '@/shared/lib/time';
import type { Activity, UserProfile } from '@/types/models';

// I1. 내 프로필
// TODO(I1): Supabase users 테이블에서 내 정보 + 학교 이름 조회
export async function getMyProfile(): Promise<UserProfile> {
  await delay(150);
  return {
    id: 'u1',
    nickname: '열정만점잼타',
    schoolId: 's1',
    schoolName: '잼타고등학교',
    grade: 2,
    role: 'STUDENT',
    studentVerified: true,
    parentVerified: false,
    anonymousDefault: true,
  };
}

// I2. 닉네임 변경
// TODO(I2): 공란/중복/길이/금칙어 검증 (MY-03) 후 users.nickname 업데이트
export async function updateNickname(nickname: string): Promise<{ ok: true } | { ok: false; message: string }> {
  await delay();
  if (!nickname.trim()) return { ok: false, message: '닉네임을 입력해 주세요.' };
  return { ok: true };
}

// I3. 익명으로 표시하기 설정 저장 (서버 저장 → 재시작해도 유지, MY-07)
// TODO(I3): users.anonymous_default 업데이트
export async function setAnonymousDefault(_value: boolean): Promise<void> {
  await delay(150);
}

// I4. 내 활동 (내 글 + 내 댓글, 최신순)
// TODO(I4): posts 와 comments 를 합쳐 최신순 정렬 (DB_SCHEMA.md 3장)
export async function getMyActivity(): Promise<Activity[]> {
  await delay();
  return [
    { id: 'a1', type: 'POST', postId: 'p2', text: '기말고사 스터디 그룹 구해요', createdAt: minutesAgo(180) },
    { id: 'a2', type: 'COMMENT', postId: 'p3', text: '이거 진짜 인정 ㅋㅋㅋ', createdAt: minutesAgo(60 * 24) },
    { id: 'a3', type: 'POST', postId: 'p1', text: '학교 축제 사진 공유해요 📸', createdAt: minutesAgo(60 * 48) },
    { id: 'a4', type: 'COMMENT', postId: 'p4', text: '저도 궁금해요!', createdAt: minutesAgo(60 * 72) },
  ];
}
