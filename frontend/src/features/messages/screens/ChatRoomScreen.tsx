// H3. 채팅방 화면 + H4 전송/실시간 수신 + H5 전송 실패
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from 'react-native';

import { getConversation, getMessages, sendMessage, subscribeMessages } from '@/features/messages/api';
import { formatChatTime } from '@/shared/lib/time';
import { useAsync } from '@/shared/lib/useAsync';
import { AppText, IconBadge, LoadingState, MessageInput, Screen, TopBar } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { Message } from '@/types/models';

export default function ChatRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const partner = useAsync(() => getConversation(id), [id]);
  const messages = useAsync(() => getMessages(id), [id]);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<Message>>(null);
  const { setData } = messages;

  // H4. 상대가 보낸 메시지 실시간 반영
  useEffect(() => subscribeMessages(id, (m) => setData((list = []) => [...list, m])), [id, setData]);

  const onSend = async () => {
    const content = draft.trim();
    if (!content) return; // 빈 메시지 차단 (CHAT-06)
    setDraft('');
    // TODO(H5): 실패하면 말풍선에 "전송 실패 · 다시 보내기" 표시
    const sent = await sendMessage(id, content);
    setData((list = []) => [...list, sent]);
  };

  if (messages.loading) return <LoadingState />;

  return (
    <Screen>
      <TopBar
        showBack
        title={partner.data?.partnerName ?? ''}
        titleSize={15}
        subtitle={partner.data?.partnerSchool}
        leading={<IconBadge name="user" size={34} iconSize={16} />}
      />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <FlatList
          ref={listRef}
          data={messages.data ?? []}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => (
            <View style={[styles.row, item.mine && styles.rowMine]}>
              <View style={[styles.bubble, item.mine ? styles.bubbleMine : styles.bubbleOther]}>
                <AppText size={13} color={item.mine ? colors.white : colors.text}>
                  {item.content}
                </AppText>
              </View>
              <AppText size={10}>{formatChatTime(item.createdAt)}</AppText>
            </View>
          )}
        />
        <MessageInput placeholder="메시지를 입력하세요" value={draft} onChangeText={setDraft} onSend={onSend} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { gap: 14, paddingTop: 18, paddingHorizontal: 16, paddingBottom: 16 },
  row: { gap: 3, alignItems: 'flex-start' },
  rowMine: { alignItems: 'flex-end' },
  bubble: { maxWidth: '80%', paddingVertical: 10, paddingHorizontal: 14 },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
});
