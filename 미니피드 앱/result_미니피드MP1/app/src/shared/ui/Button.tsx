import { ActivityIndicator, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { colors, radius } from '@/shared/theme';
import { AppText } from './AppText';

// primary: 파란 버튼 / soft: 연한 파랑 / ghost: 글자만
type Variant = 'primary' | 'soft' | 'ghost';
// lg: 큰 버튼 (15) · md: 보통 (14) · sm: 작은 버튼 (13, 상단바의 "게시" 같은 것)
type Size = 'lg' | 'md' | 'sm';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean; // true 면 눌리지 않아서 이중 제출이 막혀요
  style?: StyleProp<ViewStyle>;
};

const PALETTE: Record<Variant, { bg: string; fg: string }> = {
  primary: { bg: colors.primary, fg: colors.white },
  soft: { bg: colors.primarySoft, fg: colors.primary },
  ghost: { bg: 'transparent', fg: colors.primary },
};

const SIZES: Record<Size, { padV: number; padH: number; font: number; radius: number }> = {
  lg: { padV: 15, padH: 16, font: 15, radius: radius.md },
  md: { padV: 13, padH: 14, font: 14, radius: radius.md },
  sm: { padV: 8, padH: 16, font: 13, radius: 12 },
};

export function Button({ title, onPress, variant = 'primary', size = 'lg', disabled, loading, style }: Props) {
  const palette = PALETTE[variant];
  const metric = SIZES[size];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderRadius: metric.radius,
          paddingVertical: metric.padV,
          paddingHorizontal: metric.padH,
        },
        inactive && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <AppText size={metric.font} weight="700" color={palette.fg}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});
