// 할 일 추가 입력 카드: 입력창 + 추가 버튼
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { TITLE_MAX } from '@/features/todos/todosReducer';
import { Icon } from '@/shared/ui';
import { colors, fonts } from '@/shared/theme';

type Props = { onAdd: (title: string) => void };

export function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const canAdd = text.trim().length > 0;

  const submit = () => {
    if (!canAdd) return; // 빈 할 일은 추가하지 않아요
    onAdd(text);
    setText('');
  };

  return (
    <View style={styles.card}>
      <TextInput
        testID="todo-input"
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="할 일을 입력하세요"
        placeholderTextColor={colors.textSecondary}
        maxLength={TITLE_MAX}
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <Pressable
        testID="todo-add-button"
        accessibilityRole="button"
        accessibilityLabel="할 일 추가"
        onPress={submit}
        disabled={!canAdd}
        style={({ pressed }) => [styles.add, !canAdd && styles.addDisabled, pressed && styles.addPressed]}>
        <Icon name="plus" size={22} color={colors.white} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    paddingLeft: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  add: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addDisabled: { backgroundColor: colors.primarySoft },
  addPressed: { backgroundColor: colors.primaryDark },
});
