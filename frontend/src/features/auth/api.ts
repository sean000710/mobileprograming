// 인증 관련 서버 호출 (A1~A3).
//
// ★ 샘플 기능: signInWithPhone 은 Supabase 까지 실제로 연결돼 있어요.
//   다른 기능의 api.ts 도 이 모양(입력 검증 → Supabase 호출 → { ok, message } 결과)을 따라 만들어 주세요.
import { delay } from '@/shared/lib/mock';
import { isSupabaseConfigured, supabase } from '@/shared/lib/supabase';
import type { School } from '@/types/models';

export type AuthResult = { ok: true } | { ok: false; message: string };

export function normalizePhone(input: string): string {
  return input.replace(/[^0-9]/g, '');
}

export function isValidPhone(phone: string): boolean {
  return /^01[0-9]{8,9}$/.test(normalizePhone(phone));
}

// [팀 결정 필요] Supabase 의 SMS 로그인은 유료라서, 전화번호를 이메일 모양으로 바꿔 이메일 로그인을 씁니다.
// Supabase 대시보드 > Authentication > Sign In / Providers > Email 에서 "Confirm email" 을 꺼야 가입이 바로 됩니다.
function toAuthEmail(phone: string): string {
  return `${normalizePhone(phone)}@jamta.app`;
}

const NOT_CONFIGURED: AuthResult = {
  ok: false,
  message: 'Supabase 설정(.env)이 없어요. "개발용으로 둘러보기"를 누르거나 README 를 확인해 주세요.',
};

// A1. 로그인
export async function signInWithPhone(phone: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const { error } = await supabase.auth.signInWithPassword({ email: toAuthEmail(phone), password });
  // 계정이 있는지 없는지 알려주지 않는 문구를 씁니다 (AUTH-LOGIN-03)
  if (error) return { ok: false, message: '전화번호 또는 비밀번호가 올바르지 않아요.' };
  return { ok: true };
}

// A2. 회원가입
// TODO(A2): 가입 후 users(프로필) 테이블에 학교/닉네임 저장 — DB 담당과 방식 합의 (트리거 or 직접 insert)
// TODO(A2): 중복 전화번호 안내 (AUTH-SIGNUP-02), 비밀번호 정책 (AUTH-SIGNUP-04)
export async function signUpWithPhone(input: { phone: string; password: string; schoolId: string }): Promise<AuthResult> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;
  const { error } = await supabase.auth.signUp({
    email: toAuthEmail(input.phone),
    password: input.password,
    options: { data: { school_id: input.schoolId } },
  });
  if (error) return { ok: false, message: '가입하지 못했어요. 입력한 정보를 다시 확인해 주세요.' };
  return { ok: true };
}

// A3. 학교 찾기
// TODO(A3): 목업 대신 Supabase schools 테이블 검색으로 교체
//   예) supabase.from('schools').select('id, name, region').ilike('name', `%${keyword}%`).limit(20)
const MOCK_SCHOOLS: School[] = [
  { id: 's1', name: '잼타고등학교', region: '서울 성북구' },
  { id: 's2', name: '잼타중학교', region: '서울 성북구' },
  { id: 's3', name: '한성고등학교', region: '서울 성북구' },
  { id: 's4', name: '한성여자고등학교', region: '서울 종로구' },
];

export async function searchSchools(keyword: string): Promise<School[]> {
  await delay();
  const k = keyword.trim();
  if (!k) return [];
  return MOCK_SCHOOLS.filter((s) => s.name.includes(k));
}
