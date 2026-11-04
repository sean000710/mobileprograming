import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/theme';
import { Icon } from './Icon';

type Props = {
  children: ReactNode;
  // 파란 헤더 아래 모서리 둥글기 (.pen: 로그인 32, 회원가입/게시판 선택 28, 마이페이지 0)
  bottomRadius?: number;
  // .pen 의 padding [위, 오른쪽, 아래, 왼쪽] 에서 "위" 에서 상태바 높이를 뺀 값
  paddingTop?: number;
  paddingBottom?: number;
  decorSize?: number;
  decorOpacity?: number;
  style?: StyleProp<ViewStyle>;
};

// 로그인 / 회원가입 / 게시판 선택 / 마이페이지 위쪽의 파란 그라디언트 + 학교 장식
export function GradientHeader({
  children,
  bottomRadius = 28,
  paddingTop = 32,
  paddingBottom = 28,
  decorSize = 170,
  decorOpacity = 0.12,
  style,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.base,
        {
          paddingTop: insets.top + paddingTop,
          paddingBottom,
          borderBottomLeftRadius: bottomRadius,
          borderBottomRightRadius: bottomRadius,
        },
        style,
      ]}>
      <View pointerEvents="none" style={[styles.decor, { opacity: decorOpacity }]}>
        <Icon name="school" size={decorSize} color={colors.white} />
      </View>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: 24, overflow: 'hidden' },
  decor: { position: 'absolute', right: -20, top: -25, transform: [{ rotate: '-10deg' }] },
});
