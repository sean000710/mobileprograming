// 아이콘은 디자인(.pen)과 같은 lucide 아이콘을 씁니다. (https://lucide.dev/icons)
// 새 아이콘이 필요하면 아래 ICONS 에 한 줄 추가하세요.
import { ArrowLeft, Check, Flag, Heart, Inbox, MessageCircle, Pencil, Send, User, X } from 'lucide-react-native';

import { colors } from '@/shared/theme';

const ICONS = {
  'arrow-left': ArrowLeft,
  check: Check,
  flag: Flag,
  heart: Heart,
  inbox: Inbox,
  'message-circle': MessageCircle,
  pencil: Pencil,
  send: Send,
  user: User,
  x: X,
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  fill?: string; // 하트처럼 채워서 보여줄 때 (좋아요 누른 상태)
};

export function Icon({ name, size = 18, color = colors.textSecondary, fill }: Props) {
  const Glyph = ICONS[name];
  return <Glyph size={size} color={color} fill={fill} />;
}
