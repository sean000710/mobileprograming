// 쪽지 목록 한 줄 (.pen 의 Message Item 컴포넌트)
import { Pressable, StyleSheet, View } from 'react-native';

import { formatMessageTime } from '@/shared/lib/time';
import { AppText, IconBadge } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { Conversation } from '@/types/models';

export function MessageItem({ conversation, onPress }: { conversation: Conversation; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <IconBadge name="user" size={44} iconSize={20} />
      <View style={styles.column}>
        <View style={styles.topRow}>
          <AppText size={13} weight="700">
            {conversation.partnerName}
          </AppText>
          <AppText size={11}>{formatMessageTime(conversation.lastMessageAt)}</AppText>
        </View>
        <AppText size={12} numberOfLines={1}>
          {conversation.lastMessage}
        </AppText>
      </View>
      {conversation.unread ? <View style={styles.unreadDot} accessibilityLabel="읽지 않음" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  column: { flex: 1, gap: 3 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
