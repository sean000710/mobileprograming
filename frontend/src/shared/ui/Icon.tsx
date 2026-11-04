// 아이콘은 디자인(.pen)과 같은 lucide 아이콘을 씁니다. 이름은 .pen 에 적힌 이름 그대로예요. (https://lucide.dev/icons)
// 새 아이콘이 필요하면 아래 ICONS 에 한 줄 추가하세요. (PM 담당)
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  CircleAlert,
  CloudOff,
  FileText,
  Flag,
  GraduationCap,
  Heart,
  House,
  ImagePlus,
  Inbox,
  Info,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Pencil,
  Phone,
  Repeat,
  School,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Star,
  User,
  Users,
  X,
} from 'lucide-react-native';

import { colors } from '@/shared/theme';

const ICONS = {
  'arrow-left': ArrowLeft,
  'book-open': BookOpen,
  calendar: Calendar,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'circle-alert': CircleAlert,
  'cloud-off': CloudOff,
  'file-text': FileText,
  flag: Flag,
  'graduation-cap': GraduationCap,
  heart: Heart,
  house: House,
  'image-plus': ImagePlus,
  inbox: Inbox,
  info: Info,
  lock: Lock,
  mail: Mail,
  'map-pin': MapPin,
  megaphone: Megaphone,
  'message-circle': MessageCircle,
  pencil: Pencil,
  phone: Phone,
  repeat: Repeat,
  school: School,
  search: Search,
  send: Send,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  'shield-x': ShieldX,
  star: Star,
  user: User,
  users: Users,
  x: X,
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean; // 하트처럼 안을 채우고 싶을 때
};

export function Icon({ name, size = 18, color = colors.textSecondary, filled }: Props) {
  const Glyph = ICONS[name];
  return <Glyph size={size} color={color} fill={filled ? color : 'none'} />;
}
