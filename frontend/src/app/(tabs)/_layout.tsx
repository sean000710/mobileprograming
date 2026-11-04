// C6. 하단 탭 (홈 / 캘린더 / 메시지 / 프로필). 담당: PM
// .pen 의 Tab Bar: 높이 55, 아이콘 22, 글자 10 (선택된 탭은 파란색 + 굵게)
import { Redirect, Tabs } from 'expo-router';
import { ColorValue, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBoard } from '@/features/board/BoardProvider';
import { AppText, Icon, IconName } from '@/shared/ui';
import { colors } from '@/shared/theme';

function tabOptions(title: string, iconName: IconName) {
  return {
    title,
    tabBarIcon: ({ color }: { color: ColorValue }) => <Icon name={iconName} size={22} color={color as string} />,
    tabBarLabel: ({ focused, color }: { focused: boolean; color: ColorValue }) => (
      <AppText size={10} weight={focused ? '700' : '500'} color={color as string}>
        {title}
      </AppText>
    ),
  };
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { hasSelected } = useBoard();
  // 로그인 직후에는 게시판부터 고르게 합니다 (디자인 흐름: 로그인 → 게시판 선택 → 홈)
  if (!hasSelected) return <Redirect href="/board-select" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 55 + insets.bottom,
          paddingTop: 4,
          paddingBottom: insets.bottom,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth * 2,
        },
        tabBarItemStyle: { gap: 3 },
      }}>
      <Tabs.Screen name="index" options={tabOptions('홈', 'house')} />
      <Tabs.Screen name="calendar" options={tabOptions('캘린더', 'calendar')} />
      <Tabs.Screen name="messages" options={tabOptions('메시지', 'message-circle')} />
      <Tabs.Screen name="profile" options={tabOptions('프로필', 'user')} />
    </Tabs>
  );
}
