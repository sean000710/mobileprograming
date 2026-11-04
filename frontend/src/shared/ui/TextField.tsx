import { ReactNode } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { colors, fonts, radius } from '@/shared/theme';
import { AppText } from './AppText';
import { Icon, IconName } from './Icon';

type Props = TextInputProps & {
  icon?: IconName;
  error?: string | null; // 값이 있으면 빨간 테두리 + 아래 안내 문구
  right?: ReactNode; // 오른쪽에 붙이는 것 (예: 학교 "찾기" 버튼)
};

// .pen 의 입력칸: 흰 배경, 둥근 테두리, 왼쪽 아이콘
export function TextField({ icon, error, right, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.box, error ? styles.boxError : null]}>
        {icon ? <Icon name={icon} size={18} color={colors.textSecondary} /> : null}
        <TextInput placeholderTextColor={colors.textSecondary} style={[styles.input, style]} {...rest} />
        {right}
      </View>
      {error ? (
        <AppText size={11} color={colors.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 4, flex: 1 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  boxError: { borderColor: colors.error },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
});
