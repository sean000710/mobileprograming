import { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { IconBadge } from './IconBadge';

// warm: 노란(학부모 차단, 작성 제한) / error: 빨간(부적절한 내용, 신고) / primary: 파랑
type Tone = 'primary' | 'error' | 'warm';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  icon?: IconName;
  tone?: Tone;
  // 신고 모달처럼 조금 작은 카드 (폭 288, 제목 17, 설명 12, 아이콘 52)
  compact?: boolean;
  primaryText: string;
  onPrimary: () => void;
  primaryVariant?: 'primary' | 'danger';
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  secondaryText?: string; // 있으면 왼쪽에 "취소" 같은 버튼이 하나 더 생겨요
  onSecondary?: () => void;
  onClose?: () => void; // 오른쪽 위 X 버튼 + 안드로이드 뒤로가기. 없으면 onSecondary → onPrimary 순서로 사용
  children?: ReactNode; // 설명과 버튼 사이에 넣을 내용 (예: 신고 사유 선택)
};

const TONES: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: colors.primarySoft, fg: colors.primary },
  error: { bg: colors.errorSoft, fg: colors.error },
  warm: { bg: colors.warmSoft, fg: colors.warmDark },
};

// 디자인의 모든 안내 모달(학부모 차단, 작성 제한, 부적절한 내용, 신고)이 이 컴포넌트 하나를 씁니다.
export function AppModal({
  visible,
  title,
  message,
  icon,
  tone = 'primary',
  compact,
  primaryText,
  onPrimary,
  primaryVariant = 'primary',
  primaryDisabled,
  primaryLoading,
  secondaryText,
  onSecondary,
  onClose,
  children,
}: Props) {
  const toneColor = TONES[tone];
  const close = onClose ?? onSecondary ?? onPrimary;
  const closeSize = compact ? 26 : 28;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={close}>
      <View style={styles.overlay}>
        <View style={compact ? styles.cardCompact : styles.card}>
          <Pressable
            accessibilityLabel="닫기"
            onPress={close}
            style={[
              styles.close,
              { width: closeSize, height: closeSize, borderRadius: closeSize / 2, top: compact ? 14 : 16, right: compact ? 14 : 16 },
            ]}>
            <Icon name="x" size={compact ? 13 : 14} color={colors.textSecondary} />
          </Pressable>

          {icon ? (
            <IconBadge
              name={icon}
              size={compact ? 52 : 60}
              iconSize={compact ? 24 : 28}
              bg={toneColor.bg}
              color={toneColor.fg}
            />
          ) : null}
          <AppText jua size={compact ? 17 : title.length > 14 ? 16 : 18} style={styles.center}>
            {title}
          </AppText>
          {message ? (
            <AppText size={compact ? 12 : 13} style={styles.center}>
              {message}
            </AppText>
          ) : null}
          {children}

          <View style={styles.buttons}>
            {secondaryText ? (
              <Button title={secondaryText} variant="outline" size="md" onPress={onSecondary} style={styles.flex} />
            ) : null}
            <Button
              title={primaryText}
              variant={primaryVariant}
              size="md"
              onPress={onPrimary}
              disabled={primaryDisabled}
              loading={primaryLoading}
              style={styles.flex}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const cardBase = {
  backgroundColor: colors.surface,
  borderRadius: 22,
  gap: 14,
  alignItems: 'center',
} as const;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center' },
  card: { ...cardBase, width: 272, paddingTop: 28, paddingHorizontal: 24, paddingBottom: 24 },
  cardCompact: { ...cardBase, width: 288, paddingTop: 26, paddingHorizontal: 22, paddingBottom: 22 },
  close: {
    position: 'absolute',
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  center: { textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: 10, alignSelf: 'stretch' },
  flex: { flex: 1 },
});
