import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Props = {
  title: string;
  titleSize?: number; // 게시물/글쓰기 16, 채팅 15, 쪽지 20
  subtitle?: string;
  showBack?: boolean;
  backIcon?: 'arrow-left' | 'x'; // 글쓰기는 X 아이콘
  onBack?: () => void;
  leading?: ReactNode; // 뒤로가기 버튼 옆 (예: 채팅 상대 아바타)
  right?: ReactNode;
  centerTitle?: boolean; // 글쓰기 화면처럼 제목을 가운데에
};

// 흰 배경 + 아래 테두리 상단바 (.pen 의 Detail/Write/Chat/Messages Top Bar)
export function TopBar({
  title,
  titleSize = 16,
  subtitle,
  showBack,
  backIcon = 'arrow-left',
  onBack,
  leading,
  right,
  centerTitle,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 10 }]}>
      {showBack ? (
        <Pressable accessibilityLabel="뒤로가기" style={styles.back} onPress={onBack ?? (() => router.back())}>
          <Icon name={backIcon} size={18} color={colors.text} />
        </Pressable>
      ) : null}
      {leading}
      <View style={styles.titles}>
        <AppText jua size={titleSize} style={centerTitle ? styles.center : undefined}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText size={10} weight="500">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: { flex: 1, gap: 1 },
  center: { textAlign: 'center' },
});
