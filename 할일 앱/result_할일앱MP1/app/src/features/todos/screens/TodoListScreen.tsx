// 할 일 목록 화면: 위에서 추가하고, 카드를 탭하면 완료 표시가 바뀌어요.
// 할 일이 하나도 없으면 빈 상태 안내가 나옵니다.
import { FlatList, KeyboardAvoidingView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TodoInput } from '@/features/todos/components/TodoInput';
import { TodoItem } from '@/features/todos/components/TodoItem';
import { useTodos } from '@/features/todos/TodosProvider';
import { AppText, EmptyState, Screen, TopBar } from '@/shared/ui';
import { colors } from '@/shared/theme';

export default function TodoListScreen() {
  const insets = useSafeAreaInsets();
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();
  const doneCount = todos.filter((t) => t.done).length;
  const leftCount = todos.length - doneCount;

  return (
    <Screen>
      <TopBar title="오늘의 할 일" titleSize={20} subtitle="잼타 · 나의 할 일 목록" />

      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <View style={styles.top}>
          <TodoInput onAdd={addTodo} />
          <View style={styles.stats}>
            <View style={styles.chip}>
              <AppText size={12} weight="700" color={colors.primary}>
                남은 할 일 {leftCount}개
              </AppText>
            </View>
            <View style={[styles.chip, styles.chipDone]}>
              <AppText size={12} weight="700" color={colors.teal}>
                완료 {doneCount}개
              </AppText>
            </View>
          </View>
        </View>

        <FlatList
          testID="todo-list"
          data={todos}
          keyExtractor={(t) => t.id}
          contentContainerStyle={[styles.list, { paddingBottom: 24 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TodoItem todo={item} onToggle={() => toggleTodo(item.id)} onRemove={() => removeTodo(item.id)} />
          )}
          ListEmptyComponent={
            <EmptyState
              testID="empty-state"
              icon="clipboard-list"
              title="아직 할 일이 없어요"
              message={'위 입력창에 할 일을 적고\n+ 버튼을 눌러 추가해 보세요'}
            />
          }
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: { gap: 12, paddingHorizontal: 20, paddingTop: 16 },
  stats: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.primarySoft },
  chipDone: { backgroundColor: colors.tealSoft },
  list: { flexGrow: 1, gap: 10, paddingHorizontal: 20, paddingTop: 12 },
});
