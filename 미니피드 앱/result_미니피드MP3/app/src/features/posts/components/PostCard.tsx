// 게시글 카드: 닉네임 · 작성 시각(상대 시간) · 내용 · 좋아요/댓글 수
import { Pressable, StyleSheet, View } from 'react-native';

import { formatRelativeTime } from '@/shared/lib/time';
import { AppText, Icon, IconBadge } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { Post } from '@/features/posts/types';

type Props = {
  post: Post;
  now: Date; // 상대 시간 계산 기준 (useNow 로 갱신되는 값)
  onPress: () => void;
  onToggleLike: () => void;
};

export function PostCard({ post, now, onPress, onToggleLike }: Props) {
  return (
    <View style={styles.card}>
      {/* 본문 영역: 누르면 상세로 이동해요. 아래 버튼과 겹치지 않게 따로 분리했어요. */}
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.body}>
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

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={post.likedByMe ? '좋아요 취소' : '좋아요'}
          disabled={post.likePending}
          hitSlop={8}
          onPress={onToggleLike}
          style={styles.action}>
          <Icon
            name="heart"
            size={16}
            color={post.likedByMe ? colors.like : colors.textSecondary}
            fill={post.likedByMe ? colors.like : 'none'}
          />
          <AppText size={12} weight={post.likedByMe ? '700' : 'normal'} color={post.likedByMe ? colors.like : colors.textSecondary}>
            {post.likeCount}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="댓글 보기"
          hitSlop={8}
          onPress={onPress}
          style={styles.action}>
          <Icon name="message-circle" size={16} color={colors.textSecondary} />
          <AppText size={12} color={colors.textSecondary}>
            {post.commentCount}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  body: { gap: 10, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  content: { lineHeight: 21 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
