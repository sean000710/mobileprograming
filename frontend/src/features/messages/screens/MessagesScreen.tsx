// H1. 쪽지 목록 (받은 / 보낸) + H2 미읽음 표시
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { getConversations } from '@/features/messages/api';
import { MessageItem } from '@/features/messages/components/MessageItem';
import { useAsync } from '@/shared/lib/useAsync';
import { AppText, EmptyState, ErrorState, LoadingState, Screen, TopBar } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { MessageBox } from '@/types/models';

const SEGMENTS: { key: MessageBox; label: string }[] = [
  { key: 'received', label: '받은 쪽지' },
  { key: 'sent', label: '보낸 쪽지' },
];

export default function MessagesScreen() {
  const [box, setBox] = useState<MessageBox>('received');
  const list = useAsync(() => getConversations(box), [box]);

  return (
    <Screen>
      <TopBar title="쪽지" titleSize={20} />

      {/* 밑줄 탭: 선택된 탭은 파란 3px, 아닌 탭은 회색 1px */}
      <View style={styles.segment}>
        {SEGMENTS.map((s) => {
          const active = box === s.key;
          return (
            <Pressable key={s.key} style={[styles.tab, active ? styles.tabActive : styles.tabInactive]} onPress={() => setBox(s.key)}>
              <AppText size={14} weight={active ? '700' : '500'} color={active ? colors.primary : colors.textSecondary}>
                {s.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {list.loading ? (
        <LoadingState />
      ) : list.error ? (
        <ErrorState onRetry={list.reload} />
      ) : (
        <FlatList
          data={list.data ?? []}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <MessageItem
              conversation={item}
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}
            />
          )}
          ListEmptyComponent={<EmptyState icon="inbox" message="아직 쪽지가 없어요" />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 12, paddingBottom: 10 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: colors.primary },
  tabInactive: { borderBottomWidth: 1, borderBottomColor: colors.border },
  list: { paddingVertical: 8, paddingHorizontal: 20 },
});
