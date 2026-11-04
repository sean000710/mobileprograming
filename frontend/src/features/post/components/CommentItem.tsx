import { Pressable, StyleSheet, View } from 'react-native';

import { formatRelativeTime } from '@/shared/lib/time';
import { AppText, Icon, IconBadge } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { Comment } from '@/types/models';

// 댓글 아바타 색은 순서대로 파랑 → 노랑 → 초록으로 돌아가요 (.pen 과 동일)
const AVATAR_TONES = [
  { bg: colors.primarySoft, fg: colors.primary },
  { bg: colors.warmSoft, fg: colors.warmDark },
  { bg: colors.tealSoft, fg: colors.teal },
];

type Props = {
  comment: Comment;
  index: number;
  onToggleLike: () => void;
  // TODO(G1): 댓글 신고 버튼 (나중에 만들 것) — onReport prop 추가 후 ReportModal 연결
};

export function CommentItem({ comment, index, onToggleLike }: Props) {
  const tone = AVATAR_TONES[index % AVATAR_TONES.length];
  return (
    <View style={styles.row}>
      <IconBadge name="user" size={32} iconSize={15} bg={tone.bg} color={tone.fg} />
      <View style={styles.column}>
        <View style={styles.head}>
          <AppText size={12} weight="700">
            {comment.authorName}
          </AppText>
          <AppText size={10}>{formatRelativeTime(comment.createdAt)}</AppText>
        </View>
        <AppText size={12}>{comment.content}</AppText>
        <Pressable style={styles.likeRow} hitSlop={8} onPress={onToggleLike}>
          <Icon
            name="heart"
            size={12}
            color={comment.likedByMe ? colors.like : colors.textSecondary}
            filled={comment.likedByMe}
          />
          <AppText size={10} weight="600">
            {comment.likeCount}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  column: { flex: 1, gap: 3 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
});
