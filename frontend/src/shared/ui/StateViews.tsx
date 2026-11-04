import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { Icon } from './Icon';

// 데이터가 없을 때 (예: 게시물 없음)
export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.center}>
      <Icon name="inbox" size={36} />
      <AppText variant="caption">{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
});
