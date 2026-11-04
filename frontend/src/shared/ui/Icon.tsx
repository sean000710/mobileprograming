// 아이콘은 디자인(.pen)과 같은 lucide 아이콘을 씁니다. (https://lucide.dev/icons)
// 새 아이콘이 필요하면 아래 ICONS 에 한 줄 추가하세요.
import { ArrowLeft, Inbox, Pencil, User, X } from 'lucide-react-native';

import { colors } from '@/shared/theme';

const ICONS = {
  'arrow-left': ArrowLeft,
  inbox: Inbox,
  pencil: Pencil,
  user: User,
  x: X,
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 18, color = colors.textSecondary }: Props) {
  const Glyph = ICONS[name];
  return <Glyph size={size} color={color} />;
}
