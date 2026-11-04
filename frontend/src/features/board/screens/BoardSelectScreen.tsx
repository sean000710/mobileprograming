// B1. 게시판 선택 / B2. 학부모 게시판 차단
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BOARD_LABELS, useBoard } from '@/features/board/BoardProvider';
import { getMyProfile } from '@/features/profile/api';
import { useAsync } from '@/shared/lib/useAsync';
import { AppModal, AppText, GradientHeader, Icon, IconBadge, IconName, Screen } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { BoardType } from '@/types/models';

const OPTIONS: { type: BoardType; description: string; icon: IconName; bg: string; fg: string }[] = [
  { type: 'SCHOOL', description: '같은 학교 친구들과 편하게 소통해요', icon: 'school', bg: colors.primarySoft, fg: colors.primary },
  { type: 'REGION', description: '지역 학교 소식도 함께 확인해요', icon: 'map-pin', bg: colors.warmSoft, fg: colors.warmDark },
  { type: 'PARENT', description: '학부모님들과 학교 소식을 나눠요', icon: 'users', bg: colors.tealSoft, fg: colors.teal },
];

export default function BoardSelectScreen() {
  const { setBoardType } = useBoard();
  const { data: profile } = useAsync(getMyProfile, []);
  const [blockedOpen, setBlockedOpen] = useState(false);

  const onSelect = (type: BoardType) => {
    // 화면에서 막는 것은 안내용일 뿐이에요. 서버(RLS)에서도 반드시 막아야 합니다. (BOARD-05, DB 담당)
    if (type === 'PARENT' && !profile?.parentVerified) {
      setBlockedOpen(true);
      return;
    }
    setBoardType(type);
    // 홈에서 "게시판 고르러가기"로 왔으면 뒤로, 로그인 직후 처음이면 홈으로
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <Screen edges={['bottom']}>
      <GradientHeader style={styles.header}>
        <AppText jua size={24} color={colors.white}>
          게시판 선택
        </AppText>
        <AppText size={13} color={colors.primarySoft}>
          어떤 게시판부터 둘러볼까요?
        </AppText>
      </GradientHeader>

      <ScrollView contentContainerStyle={styles.body}>
        <AppText size={13} weight="600">
          보고 싶은 게시판을 선택해요 !
        </AppText>

        {OPTIONS.map((o) => (
          <Pressable key={o.type} style={styles.card} onPress={() => onSelect(o.type)}>
            <IconBadge name={o.icon} size={52} iconSize={24} bg={o.bg} color={o.fg} />
            <View style={styles.cardText}>
              <AppText size={14} weight="700">
                {BOARD_LABELS[o.type]} 보러가기
              </AppText>
              <AppText size={11}>{o.description}</AppText>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textSecondary} />
          </Pressable>
        ))}

        <View style={styles.spacer} />
        <AppText size={11} style={styles.hint}>
          나중에 설정에서 언제든 바꿀 수 있어요
        </AppText>
      </ScrollView>

      <AppModal
        visible={blockedOpen}
        icon="shield-alert"
        tone="warm"
        title="접근할 수 없어요"
        message="학부모 게시판은 학부모 인증을 받은 계정만 이용할 수 있어요"
        primaryText="확인했어요"
        onPrimary={() => setBlockedOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: 6 },
  body: { flexGrow: 1, paddingTop: 32, paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardText: { flex: 1, gap: 4 },
  spacer: { flex: 1 },
  hint: { textAlign: 'center' },
});
