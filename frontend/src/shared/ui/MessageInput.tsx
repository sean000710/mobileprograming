import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/shared/theme';
import { Icon } from './Icon';
import { IconBadge } from './IconBadge';

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  showAvatar?: boolean; // 댓글 입력창은 왼쪽에 내 아바타가 있어요
  disabled?: boolean;
};

// 화면 맨 아래 입력창 (댓글 / 채팅 공통)
export function MessageInput({ placeholder, value, onChangeText, onSend, showAvatar, disabled }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: 12 + insets.bottom }]}>
      {showAvatar ? <IconBadge name="user" size={28} iconSize={13} /> : null}
      <TextInput
        style={styles.field}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSend}
      />
      <Pressable accessibilityLabel="보내기" style={styles.send} onPress={onSend} disabled={disabled}>
        <Icon name="send" size={15} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  field: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.bg,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
