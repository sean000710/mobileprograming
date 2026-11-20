import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/shared/theme';

type Props = {
  children: ReactNode;
  // 안전 영역을 피할 방향. 위쪽은 TopBar/GradientHeader 가 알아서 처리하니 보통 비워 두세요.
  edges?: Edge[];
  background?: string;
  style?: StyleProp<ViewStyle>;
};

// 모든 화면의 가장 바깥 틀 (배경색 #F5F8FF)
export function Screen({ children, edges, background = colors.bg, style }: Props) {
  if (edges && edges.length > 0) {
    return (
      <SafeAreaView edges={edges} style={[styles.flex, { backgroundColor: background }, style]}>
        {children}
      </SafeAreaView>
    );
  }
  return <View style={[styles.flex, { backgroundColor: background }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
