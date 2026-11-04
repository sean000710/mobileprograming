// .pen 의 토글 (파란 트랙 44x26 + 흰 동그라미 20)
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function Toggle({ value, onValueChange }: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[styles.track, { backgroundColor: value ? colors.primary : colors.border, alignItems: value ? 'flex-end' : 'flex-start' }]}>
      <View style={styles.knob} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 44, height: 26, borderRadius: 13, padding: 3, justifyContent: 'center' },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white },
});
