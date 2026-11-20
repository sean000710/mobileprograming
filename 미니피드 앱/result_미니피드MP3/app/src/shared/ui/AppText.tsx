import { Text, TextProps } from 'react-native';

import { colors, fonts } from '@/shared/theme';

// .pen 의 fontWeight 와 같은 이름: normal / 500 / 600 / 700
export type Weight = 'normal' | '500' | '600' | '700';

const FONT_BY_WEIGHT: Record<Weight, string> = {
  normal: fonts.regular,
  '500': fonts.medium,
  '600': fonts.semibold,
  '700': fonts.bold,
};

type Variant = 'body' | 'bodyBold' | 'caption' | 'small';

const PRESETS: Record<Variant, { size: number; weight: Weight; color: string }> = {
  body: { size: 14, weight: 'normal', color: colors.text },
  bodyBold: { size: 14, weight: '700', color: colors.text },
  caption: { size: 12, weight: 'normal', color: colors.textSecondary },
  small: { size: 11, weight: 'normal', color: colors.textSecondary },
};

type Props = TextProps & {
  variant?: Variant; // 자주 쓰는 모양 4가지
  size?: number; // .pen 에 적힌 fontSize 그대로
  weight?: Weight; // .pen 에 적힌 fontWeight 그대로
  jua?: boolean; // 제목용 Jua 폰트 (.pen 에서 fontFamily 가 Jua 인 글자)
  color?: string;
};

// 앱의 모든 글자는 Text 대신 AppText 를 쓰세요. 폰트/색이 디자인과 맞춰집니다.
// 예) <AppText size={13} weight="700" color={colors.primary}>회원가입</AppText>
export function AppText({ variant = 'body', size, weight, jua, color, style, ...rest }: Props) {
  const preset = PRESETS[variant];
  return (
    <Text
      style={[
        {
          fontFamily: jua ? fonts.heading : FONT_BY_WEIGHT[weight ?? preset.weight],
          fontSize: size ?? preset.size,
          color: color ?? preset.color,
          includeFontPadding: false, // 안드로이드에서 글자 위아래에 붙는 기본 여백 제거 (디자인과 간격을 맞추기 위해)
        },
        style,
      ]}
      {...rest}
    />
  );
}
