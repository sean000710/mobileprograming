// I. 마이페이지 (I1 프로필, I2 닉네임 변경, I3 익명 토글, I4 내 활동)
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { getMyActivity, getMyProfile, setAnonymousDefault } from '@/features/profile/api';
import { Toggle } from '@/features/profile/components/Toggle';
import { formatRelativeTime } from '@/shared/lib/time';
import { useAsync } from '@/shared/lib/useAsync';
import { AppText, Button, GradientHeader, Icon, IconBadge, LoadingState, Screen } from '@/shared/ui';
import { colors } from '@/shared/theme';

export default function MyPageScreen() {
  const { signOut } = useAuth();
  const profile = useAsync(getMyProfile, []);
  const activity = useAsync(getMyActivity, []);

  const onToggleAnonymous = async (value: boolean) => {
    profile.setData((prev) => ({ ...prev!, anonymousDefault: value }));
    await setAnonymousDefault(value);
  };

  if (profile.loading || !profile.data) return <LoadingState />;
  const p = profile.data;

  return (
    <Screen>
      <ScrollView>
        {/* I1. 프로필 헤더 */}
        <GradientHeader bottomRadius={0} paddingTop={28} paddingBottom={26}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Icon name="user" size={30} color={colors.primary} />
            </View>
            <View style={styles.info}>
              <View style={styles.nicknameRow}>
                <AppText jua size={18} color={colors.white}>
                  {p.nickname}
                </AppText>
                {/* TODO(I2): 닉네임 변경 입력 모달 → updateNickname */}
                <Pressable style={styles.changeButton}>
                  <Icon name="pencil" size={11} color={colors.white} />
                  <AppText size={11} weight="700" color={colors.white}>
                    변경
                  </AppText>
                </Pressable>
              </View>
              <View style={styles.schoolRow}>
                <Icon name="school" size={13} color={colors.primarySoft} />
                <AppText size={12} weight="500" color={colors.primarySoft}>
                  {p.schoolName}
                  {p.grade ? ` · ${p.grade}학년` : ''}
                </AppText>
              </View>
            </View>
          </View>
        </GradientHeader>

        <View style={styles.body}>
          {/* I3. 익명으로 표시하기 */}
          <View style={styles.toggleCard}>
            <View style={styles.toggleText}>
              <AppText size={14} weight="700">
                익명으로 표시하기
              </AppText>
              <AppText size={11}>게시물과 댓글에 닉네임 대신 익명으로 표시돼요</AppText>
            </View>
            <Toggle value={p.anonymousDefault} onValueChange={onToggleAnonymous} />
          </View>

          {/* I4. 내 활동 */}
          <AppText size={14} weight="700">
            내 활동
          </AppText>
          <View>
            {(activity.data ?? []).map((a) => (
              <Pressable
                key={a.id}
                style={styles.activityRow}
                onPress={() => router.push({ pathname: '/post/[id]', params: { id: a.postId } })}>
                <IconBadge name={a.type === 'POST' ? 'file-text' : 'message-circle'} size={36} iconSize={16} />
                <View style={styles.activityText}>
                  <AppText size={11} weight="600">
                    {a.type === 'POST' ? '게시물을 작성했어요' : '댓글을 남겼어요'}
                  </AppText>
                  <AppText size={13} weight="500" numberOfLines={1}>
                    {a.text}
                  </AppText>
                </View>
                <AppText size={11}>{formatRelativeTime(a.createdAt)}</AppText>
              </Pressable>
            ))}
          </View>

          {/* 디자인에는 없지만 개발/테스트용으로 둡니다. 범위 결정 필요 (MY-12) */}
          <Button title="로그아웃" variant="ghost" size="md" onPress={signOut} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 6 },
  nicknameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF29',
  },
  schoolRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  body: { gap: 18, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleText: { flex: 1, gap: 3 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityText: { flex: 1, gap: 2 },
});
