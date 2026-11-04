import { StyleSheet, View } from 'react-native';

import { formatRelativeTime } from '@/shared/lib/time';
import { colors } from '@/shared/theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Props = {
  schoolName: string;
  authorName: string;
  createdAt: string;
};

// "🏫 잼타고등학교 • 익명 • 5분 전" — 게시물 카드와 상세 화면이 같이 씁니다
export function PostMeta({ schoolName, authorName, createdAt }: Props) {
  return (
    <View style={styles.row}>
      <Icon name="school" size={13} color={colors.primary} />
      <AppText size={11} weight="600" color={colors.primary}>
        {schoolName}
      </AppText>
      <AppText size={11}>•</AppText>
      <AppText size={11} weight="600">
        {authorName}
      </AppText>
      <AppText size={11}>•</AppText>
      <AppText size={11}>{formatRelativeTime(createdAt)}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
