// 게시글 상세: 카드를 눌렀을 때 열리는 화면. 닉네임, 작성 시각, 내용 전체를 보여줘요.
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { usePosts } from '@/features/posts/PostsProvider';
import { formatRelativeTime, useNow } from '@/shared/lib/time';
import { AppText, EmptyState, IconBadge, Screen, TopBar } from '@/shared/ui';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPost } = usePosts();
  const now = useNow();
  const post = getPost(id);

  return (
    <Screen>
      <TopBar title="게시물" showBack />
      {post ? (
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.header}>
            <IconBadge name="user" size={40} iconSize={18} />
            <View style={styles.names}>
              <AppText size={14} weight="700">
                {post.nickname}
              </AppText>
              <AppText size={11}>{formatRelativeTime(post.createdAt, now)}</AppText>
            </View>
          </View>
          <AppText size={15} style={styles.content}>
            {post.content}
          </AppText>
        </ScrollView>
      ) : (
        <EmptyState message="존재하지 않는 게시물이에요." />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { gap: 18, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  names: { gap: 2 },
  content: { lineHeight: 24 },
});
