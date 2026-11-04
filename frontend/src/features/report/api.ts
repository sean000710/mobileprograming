// 신고 서버 호출 (G2)
import { delay } from '@/shared/lib/mock';
import type { ReportReason, ReportTargetType } from '@/types/models';

export type ReportResult = { ok: true } | { ok: false; reason: 'DUPLICATE' | 'OWN_CONTENT' | 'UNKNOWN' };

// TODO(G2): Supabase reports insert. 중복 신고는 UNIQUE(reporter_id, target_type, target_id) 로 막기 (REPORT-06)
// TODO(G3): 신고 누적 시 자동 숨김은 서버(DB 트리거 or Python)에서 처리
export async function submitReport(input: {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  detail?: string;
}): Promise<ReportResult> {
  await delay();
  return { ok: true };
}
