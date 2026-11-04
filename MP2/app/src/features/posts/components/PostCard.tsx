// 게시글 카드: 닉네임 · 작성 시각(상대 시간) · 내용
import { Pressable, StyleSheet, View } from 'react-native';

import { formatRelativeTime } from '@/shared/lib/time';
import { AppText, IconBadge } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { Post } from '@/features/posts/types';

type Props = {
  post: Post;
  now: Date; // 상대 시간 계산 기준 (useNow 로 갱신되는 값)
  onPress: () => void;
};

export function PostCard({ post, now, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <IconBadge name="user" size={32} iconSize={15} />
        <AppText size={13} weight="700">
          {post.nickname}
        </AppText>
        <AppText size={11}>• {formatRelativeTime(post.createdAt, now)}</AppText>
      </View>
      <AppText size={14} numberOfLines={3} style={styles.content}>
        {post.content}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  content: { lineHeight: 21 },
});
