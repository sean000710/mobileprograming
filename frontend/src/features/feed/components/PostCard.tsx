// C4. 게시물 카드 (.pen 의 Post Card 컴포넌트)
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Icon, PostMeta } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { PostSummary } from '@/types/models';

type Props = {
  post: PostSummary;
  onPress: () => void;
  onReport: () => void; // 오른쪽 아래 깃발 아이콘 → 신고 모달 (G1)
};

export function PostCard({ post, onPress, onReport }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <AppText size={14} weight="700" numberOfLines={1} style={styles.flex}>
          {post.title}
        </AppText>
        {post.thumbnailUrl ? <Image source={post.thumbnailUrl} style={styles.thumb} contentFit="cover" /> : null}
      </View>

      <View style={styles.likeRow}>
        <Icon name="heart" size={14} color={colors.like} />
        <AppText size={12} weight="600">
          {post.likeCount}
        </AppText>
      </View>

      <AppText size={12} numberOfLines={1}>
        {post.preview}
      </AppText>

      <View style={styles.metaRow}>
        <PostMeta schoolName={post.schoolName} authorName={post.authorName} createdAt={post.createdAt} />
        <Pressable accessibilityLabel="신고하기" hitSlop={10} onPress={onReport} style={styles.report}>
          <Icon name="flag" size={13} color={colors.textSecondary} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  flex: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  thumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: colors.border },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  report: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
});
