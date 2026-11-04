// 피드: 게시글 카드가 세로로 쌓인 스크롤 목록. 카드를 누르면 상세로, 연필 버튼을 누르면 글쓰기로 이동해요.
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostCard } from '@/features/posts/components/PostCard';
import { usePosts } from '@/features/posts/PostsProvider';
import type { Post } from '@/features/posts/types';
import { useNow } from '@/shared/lib/time';
import { EmptyState, Icon, Screen, TopBar } from '@/shared/ui';
import { colors } from '@/shared/theme';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const { posts } = usePosts();
  const now = useNow();
  const listRef = useRef<FlatList<Post>>(null);

  // 새 글이 추가되면 목록을 맨 위로 올려서 방금 쓴 글이 바로 보이게 해요.
  const newestId = posts[0]?.id;
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [newestId]);

  return (
    <Screen>
      <TopBar title="우리 학교 게시판" titleSize={18} subtitle="잼타고등학교" />

      <FlatList
        ref={listRef}
        data={posts}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            now={now}
            onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={<EmptyState message="아직 게시물이 없어요. 첫 글을 남겨보세요!" />}
      />

      <Pressable
        accessibilityLabel="글쓰기"
        style={[styles.fab, { bottom: 20 + insets.bottom }]}
        onPress={() => router.push('/post/write')}>
        <Icon name="pencil" size={22} color={colors.white} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { flexGrow: 1, gap: 12, paddingVertical: 16, paddingHorizontal: 20, paddingBottom: 96 },
  fab: {
    position: 'absolute',
    right: 20,
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
