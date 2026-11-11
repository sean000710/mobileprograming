// 할 일 카드: 탭하면 완료 ↔ 미완료가 바뀌고, 오른쪽 휴지통으로 삭제해요.
import { Pressable, StyleSheet, View } from 'react-native';

import type { Todo } from '@/features/todos/types';
import { AppText, Icon } from '@/shared/ui';
import { colors } from '@/shared/theme';

type Props = {
  todo: Todo;
  onToggle: () => void;
  onRemove: () => void;
};

export function TodoItem({ todo, onToggle, onRemove }: Props) {
  return (
    <View style={[styles.card, todo.done && styles.cardDone]}>
      <Pressable
        testID={`todo-item-${todo.title}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.done }}
        accessibilityLabel={todo.title}
        onPress={onToggle}
        style={styles.main}>
        <View style={[styles.check, todo.done && styles.checkDone]}>
          {todo.done ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}
        </View>
        <AppText
          size={14}
          weight={todo.done ? 'normal' : '600'}
          color={todo.done ? colors.textSecondary : colors.text}
          numberOfLines={2}
          style={[styles.title, todo.done && styles.titleDone]}>
          {todo.title}
        </AppText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${todo.title} 삭제`}
        hitSlop={10}
        onPress={onRemove}
        style={styles.remove}>
        <Icon name="trash" size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  cardDone: { backgroundColor: colors.bg },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16, paddingLeft: 16 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  title: { flex: 1, lineHeight: 20 },
  titleDone: { textDecorationLine: 'line-through' },
  remove: { padding: 6 },
});
