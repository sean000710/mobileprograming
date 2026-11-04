import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Icon, IconName } from './Icon';

// 데이터가 없을 때 (예: 게시물 없음, 쪽지 없음)
export function EmptyState({ icon = 'inbox', message }: { icon?: IconName; message: string }) {
  return (
    <View style={styles.center}>
      <Icon name={icon} size={36} />
      <AppText variant="caption">{message}</AppText>
    </View>
  );
}

// 불러오는 중
export function LoadingState() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

// 불러오기 실패 (네트워크 오류 등)
export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <Icon name="cloud-off" size={36} />
      <AppText variant="caption">불러오지 못했어요. 잠시 후 다시 시도해 주세요.</AppText>
      {onRetry ? <Button title="다시 시도" variant="soft" size="sm" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
});
