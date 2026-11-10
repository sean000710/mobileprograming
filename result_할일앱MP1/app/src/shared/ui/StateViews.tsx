import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { IconBadge } from './IconBadge';
import type { IconName } from './Icon';

type Props = {
  title: string;
  message?: string;
  icon?: IconName;
  testID?: string;
};

// 데이터가 없을 때 보여주는 안내 (예: 할 일 없음)
export function EmptyState({ title, message, icon = 'inbox', testID }: Props) {
  return (
    <View testID={testID} style={styles.center}>
      <IconBadge name={icon} size={72} iconSize={32} />
      <AppText jua size={18} style={styles.title}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="caption" style={styles.message}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 32 },
  title: { marginTop: 6 },
  message: { textAlign: 'center', lineHeight: 19 },
});
