// G1. 신고 모달 (게시물/댓글/쪽지 어디서든 재사용)
// 사용법: <ReportModal target={{ type: 'POST', id }} onClose={...} />  target 이 null 이면 닫힘
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { submitReport } from '@/features/report/api';
import { AppModal, AppText, Icon } from '@/shared/ui';
import { colors } from '@/shared/theme';
import { REPORT_REASONS, ReportReason, ReportTargetType } from '@/types/models';

type Props = {
  target: { type: ReportTargetType; id: string } | null;
  onClose: () => void;
};

export function ReportModal({ target, onClose }: Props) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    setReason(null);
    setListOpen(false);
    onClose();
  };

  const onSubmit = async () => {
    if (!target || !reason) return;
    setSubmitting(true);
    // TODO(G1): '기타' 선택 시 상세 사유 입력란 (나중에 만들 것)
    const result = await submitReport({ targetType: target.type, targetId: target.id, reason });
    setSubmitting(false);
    close();
    if (result.ok) Alert.alert('신고가 접수됐어요', '검토 후 조치할게요.');
    else if (result.reason === 'DUPLICATE') Alert.alert('이미 신고한 게시물이에요');
    else Alert.alert('신고하지 못했어요', '잠시 후 다시 시도해 주세요.');
  };

  return (
    <AppModal
      visible={target !== null}
      compact
      icon="flag"
      tone="error"
      title="신고하시겠습니까?"
      message="신고 사유를 선택해주시면 검토 후 조치할게요"
      onClose={close}
      secondaryText="취소"
      onSecondary={close}
      primaryText="신고하기"
      primaryVariant="danger"
      onPrimary={onSubmit}
      primaryDisabled={!reason}
      primaryLoading={submitting}>
      <View style={styles.wrap}>
        <Pressable style={[styles.select, listOpen && styles.selectOpen]} onPress={() => setListOpen((v) => !v)}>
          <AppText size={13} color={reason ? colors.text : colors.textSecondary}>
            {reason ?? '신고 사유를 선택해주세요'}
          </AppText>
          <Icon
            name={listOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={listOpen ? colors.primary : colors.textSecondary}
          />
        </Pressable>

        {/* .pen 에서는 목록이 버튼 위로 겹쳐 뜨지만, 안드로이드에서 터치가 안 먹는 문제가 있어 아래로 펼쳐지게 했어요 */}
        {listOpen ? (
          <View style={styles.options}>
            {REPORT_REASONS.map((r, i) => (
              <Pressable
                key={r}
                style={[styles.option, i < REPORT_REASONS.length - 1 && styles.optionDivider]}
                onPress={() => {
                  setReason(r);
                  setListOpen(false);
                }}>
                <AppText size={13} weight={r === reason ? '700' : 'normal'} color={r === reason ? colors.primary : colors.text}>
                  {r}
                </AppText>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', gap: 4 },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  selectOpen: { borderColor: colors.primary },
  options: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  option: { paddingVertical: 12, paddingHorizontal: 14 },
  optionDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
});
