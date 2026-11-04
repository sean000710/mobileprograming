// 글쓰기 서버 호출 (E1, F1, F2)
//
// ★ 서버 약속(API 계약): createPost 는 실패 이유를 reason 으로 알려줍니다.
//   화면은 reason 에 따라 모달을 고릅니다. 서버(Python/RLS) 담당과 이 이름을 맞춰 주세요.
import { delay } from '@/shared/lib/mock';
import type { BoardType } from '@/types/models';

export type WriteFailReason = 'RATE_LIMIT' | 'INAPPROPRIATE' | 'UNKNOWN';
export type WriteResult = { ok: true; postId: string } | { ok: false; reason: WriteFailReason };

export const TITLE_MAX = 100;
export const CONTENT_MAX = 1000;
export const IMAGE_MAX = 5;

// F1. 글쓰기 화면에 들어가기 전에 작성 횟수 제한 확인
// TODO(F1): 서버에서 최근 N분 작성 수 확인 (N 은 팀 결정). 화면 검사는 안내용, 진짜 차단은 서버에서 (GUARD-05)
export async function checkCanWrite(): Promise<{ ok: true } | { ok: false; reason: 'RATE_LIMIT' }> {
  await delay(100);
  return { ok: true };
}

// E1. 게시
// TODO(E1): Supabase(or Python 서버) 로 게시 요청. 서버가 필터(F2)/횟수 제한(F1)을 검사해서 reason 으로 응답
// TODO(E3): imageUris 를 Supabase Storage 에 올리고 post_images 에 저장
export async function createPost(input: {
  boardType: BoardType;
  title: string;
  content: string;
  isAnonymous: boolean;
  imageUris: string[];
}): Promise<WriteResult> {
  await delay(500);
  // 목업: "욕설" 이라는 단어가 들어가면 부적절 내용 모달을 확인할 수 있어요.
  if (`${input.title} ${input.content}`.includes('욕설')) return { ok: false, reason: 'INAPPROPRIATE' };
  return { ok: true, postId: `p${Date.now()}` };
}
