// 디자인 토큰 (JamSNS.pen 의 변수와 동일). 색상/폰트는 여기서만 가져다 쓰세요.
// 담당: PM. 새 색이 필요하면 직접 추가하지 말고 PM에게 요청해 주세요.

export const colors = {
  primary: '#2563EB',
  primaryDark: '#173F94',
  primarySoft: '#DCE8FF',
  accent: '#60A5FA',
  warm: '#FFB74D',
  warmDark: '#B4650A',
  warmSoft: '#FFF1DC',
  teal: '#0E9E8F',
  tealSoft: '#DAF3EF',
  like: '#EF4444',
  error: '#E23D32',
  errorSoft: '#FDE2E1',
  bg: '#F5F8FF',
  surface: '#FFFFFF',
  border: '#DCE3F0',
  text: '#1B1B1B',
  textSecondary: '#6B7690',
  overlay: '#10203D99',
  white: '#FFFFFF',
} as const;

// 폰트는 굵기마다 이름이 달라요. fontWeight 대신 fontFamily 를 바꿔서 굵기를 조절합니다.
export const fonts = {
  heading: 'Jua_400Regular',
  regular: 'NotoSansKR_400Regular',
  medium: 'NotoSansKR_500Medium',
  semibold: 'NotoSansKR_600SemiBold',
  bold: 'NotoSansKR_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 26,
  full: 999,
} as const;
