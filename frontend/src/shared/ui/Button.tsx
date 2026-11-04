import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius } from '@/shared/theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

// primary: 파란 버튼 / gradient: 가입 버튼 / danger: 신고하기 / outline: 취소 / warm: 학교 찾기 / soft: 연한 파랑 / ghost: 글자만
type Variant = 'primary' | 'gradient' | 'danger' | 'outline' | 'warm' | 'soft' | 'ghost';
// lg: 로그인/회원가입 (15) · md: 모달 버튼 (14) · sm: 작은 버튼 (13)
type Size = 'lg' | 'md' | 'sm';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean; // true 면 눌리지 않아서 이중 제출이 막혀요
  style?: StyleProp<ViewStyle>;
};

const PALETTE: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, fg: colors.white },
  gradient: { bg: 'transparent', fg: colors.white },
  danger: { bg: colors.error, fg: colors.white },
  outline: { bg: colors.surface, fg: colors.text, border: colors.border },
  warm: { bg: colors.warm, fg: colors.white },
  soft: { bg: colors.primarySoft, fg: colors.primary },
  ghost: { bg: 'transparent', fg: colors.primary },
};

const SIZES: Record<Size, { padV: number; padH: number; font: number; radius: number }> = {
  lg: { padV: 15, padH: 16, font: 15, radius: radius.md },
  md: { padV: 13, padH: 14, font: 14, radius: radius.md },
  sm: { padV: 8, padH: 16, font: 13, radius: 12 },
};

export function Button({ title, onPress, variant = 'primary', size = 'lg', icon, disabled, loading, style }: Props) {
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
          borderWidth: palette.border ? 1 : 0,
          borderColor: palette.border,
        },
        inactive && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {variant === 'gradient' ? (
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={15} color={palette.fg} /> : null}
          <AppText size={metric.font} weight="700" color={palette.fg}>
            {title}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});
