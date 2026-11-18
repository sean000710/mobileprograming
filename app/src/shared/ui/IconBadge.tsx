import { View } from 'react-native';

import { colors } from '@/shared/theme';
import { Icon, IconName } from './Icon';

type Props = {
  name: IconName;
  size?: number; // 동그라미 지름
  iconSize?: number;
  bg?: string;
  color?: string;
};

// 동그란 배경 안에 아이콘 (아바타, 모달 상단, 카드 아이콘 등에 공통으로 사용)
export function IconBadge({ name, size = 36, iconSize = 16, bg = colors.primarySoft, color = colors.primary }: Props) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name={name} size={iconSize} color={color} />
    </View>
  );
}
