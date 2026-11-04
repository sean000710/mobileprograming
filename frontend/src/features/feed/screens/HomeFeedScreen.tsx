// C. 홈 피드 (C1 상단바, C2 공지, C3 인기 게시물, C5 목록) + 글쓰기 버튼(F1 작성 제한)
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOARD_LABELS, useBoard } from '@/features/board/BoardProvider';
import { getNotice, getPopularPosts, getPosts } from '@/features/feed/api';
import { PopularCarousel } from '@/features/feed/components/PopularCarousel';
import { PostCard } from '@/features/feed/components/PostCard';
import { getMyProfile } from '@/features/profile/api';
import { ReportModal } from '@/features/report/components/ReportModal';
import { checkCanWrite } from '@/features/write/api';
import { useAsync } from '@/shared/lib/useAsync';
import { AppModal, AppText, EmptyState, ErrorState, Icon, LoadingState, Screen } from '@/shared/ui';
import { colors } from '@/shared/theme';

export default function HomeFeedScreen() {
  const insets = useSafeAreaInsets();
  const { boardType } = useBoard();
  const { data: profile } = useAsync(getMyProfile, []);
  const notice = useAsync(() => getNotice(boardType), [boardType]);
  const popular = useAsync(() => getPopularPosts(boardType), [boardType]);
  const feed = useAsync(() => getPosts(boardType, 0), [boardType]);
  // TODO(C5): 아래로 스크롤하면 다음 페이지 불러오기 (onEndReached), 중복 제거

  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [limitOpen, setLimitOpen] = useState(false);

  const onRefresh = () => {
    notice.reload();
    popular.reload();
    feed.reload();
  };

  const onPressWrite = async () => {
    const result = await checkCanWrite();
    if (!result.ok) return setLimitOpen(true);
    router.push('/post/write');
  };

  const openPost = (id: string) => router.push({ pathname: '/post/[id]', params: { id } });

  return (
    <Screen>
      {/* C1. 상단바 */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <View style={styles.titleColumn}>
          <AppText jua size={18}>
            {BOARD_LABELS[boardType]}
          </AppText>
          <AppText size={11} weight="500">
            {profile?.schoolName ?? ''}
          </AppText>
        </View>
        <Pressable style={styles.switchButton} onPress={() => router.push('/board-select')}>
          <Icon name="repeat" size={14} color={colors.primary} />
          <AppText size={11} weight="700" color={colors.primary}>
            게시판 고르러가기
          </AppText>
        </Pressable>
      </View>

      {/* C2. 공지 배너 */}
      {notice.data ? (
        <View style={styles.notice}>
          <Icon name="megaphone" size={15} color={colors.warmDark} />
          <AppText size={12} weight="600" color={colors.warmDark}>
            {notice.data.title}
          </AppText>
        </View>
      ) : null}

      {feed.loading && !feed.data ? (
        <LoadingState />
      ) : feed.error ? (
        <ErrorState onRetry={feed.reload} />
      ) : (
        <FlatList
          data={feed.data?.items ?? []}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <PopularCarousel
              posts={popular.data ?? []}
              onPressPost={openPost}
              onReport={(id) => setReportPostId(id)}
            />
          }
          renderItem={({ item }) => (
            <PostCard post={item} onPress={() => openPost(item.id)} onReport={() => setReportPostId(item.id)} />
          )}
          ListEmptyComponent={<EmptyState message="아직 게시물이 없어요. 첫 글을 남겨보세요!" />}
          refreshControl={<RefreshControl refreshing={feed.loading} onRefresh={onRefresh} />}
        />
      )}

      {/* 글쓰기 버튼 */}
      <Pressable accessibilityLabel="글쓰기" style={styles.fab} onPress={onPressWrite}>
        <Icon name="pencil" size={22} color={colors.white} />
      </Pressable>

      <ReportModal
        target={reportPostId ? { type: 'POST', id: reportPostId } : null}
        onClose={() => setReportPostId(null)}
      />

      {/* F1. 작성 횟수 초과 */}
      <AppModal
        visible={limitOpen}
        icon="circle-alert"
        tone="error"
        title="게시글 작성 횟수를 초과했습니다"
        message="단시간 안에 여러 게시물을 작성 할 수 없어요. 잠시후 다시 시도하세요."
        primaryText="확인했어요"
        onPrimary={() => setLimitOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleColumn: { gap: 2, flexShrink: 1 },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.warmSoft,
  },
  list: { paddingVertical: 16, paddingHorizontal: 20, gap: 12, paddingBottom: 92 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#1E3A5F',
    shadowOpacity: 0.33,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
});
