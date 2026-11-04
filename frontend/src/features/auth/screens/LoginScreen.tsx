// A1. 로그인 화면 (★ 샘플 기능 — 화면 → api.ts → Supabase 흐름의 예시)
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { isValidPhone, signInWithPhone } from '@/features/auth/api';
import { isSupabaseConfigured } from '@/shared/lib/supabase';
import { AppText, Button, GradientHeader, Icon, TextField } from '@/shared/ui';
import { colors } from '@/shared/theme';

export default function LoginScreen() {
  const { enterDevMode } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false); // TODO(A1): 켜면 앱을 다시 켜도 로그인 유지, 끄면 로그아웃 (AUTH-LOGIN-06/07)
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // 1) 입력 검증: 서버에 보내기 전에 화면에서 먼저 확인합니다.
    if (!phone || !password) return setError('전화번호와 비밀번호를 입력해 주세요.');
    if (!isValidPhone(phone)) return setError('전화번호 형식을 확인해 주세요. (예: 01012345678)');

    // 2) 서버 호출: api.ts 의 함수만 부르고, Supabase 를 화면에서 직접 부르지 않습니다.
    setLoading(true);
    setError(null);
    const result = await signInWithPhone(phone, password);
    setLoading(false);

    // 3) 결과 처리. 성공하면 AuthProvider 가 세션을 감지해서 자동으로 게시판 선택 화면으로 이동해요.
    if (!result.ok) {
      setError(result.message);
      setPassword('');
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* 헤더: 장식 아이콘, 연필/책 배지, 로고 */}
      <GradientHeader bottomRadius={32} paddingTop={32} paddingBottom={32} decorSize={210} decorOpacity={0.14} style={styles.header}>
        <View style={[styles.deco, styles.decoPencil]}>
          <Icon name="pencil" size={16} color={colors.white} />
        </View>
        <View style={[styles.deco, styles.decoBook]}>
          <Icon name="book-open" size={16} color={colors.primary} />
        </View>

        <View style={styles.logoBadge}>
          <Icon name="shield-check" size={34} color={colors.primary} />
          <View style={styles.starBadge}>
            <Icon name="star" size={11} color={colors.white} />
          </View>
        </View>
        <AppText jua size={30} color={colors.white}>
          잼타
        </AppText>
        <AppText size={13} weight="500" color={colors.primarySoft}>
          학생을 위한 안심 SNS
        </AppText>
      </GradientHeader>

      <View style={styles.body}>
        <AppText jua size={22}>
          환영해요!
        </AppText>
        <AppText size={13}>학교 이메일로 가입하고 친구들과 안전하게 소통해요</AppText>

        {/* 디자인(.pen)의 첫 번째 입력칸 아이콘이 편지(mail)라서 그대로 맞췄어요 */}
        <View style={styles.fields}>
          <View style={styles.fieldRow}>
            <TextField
              icon="mail"
              placeholder="전화번호"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={13}
            />
          </View>
          <View style={styles.fieldRow}>
            <TextField
              icon="lock"
              placeholder="비밀번호"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={error}
            />
          </View>
        </View>

        <View style={styles.rememberRow}>
          <Pressable style={styles.rememberLeft} onPress={() => setKeepSignedIn((v) => !v)} accessibilityRole="checkbox">
            <View style={[styles.checkbox, keepSignedIn && styles.checkboxOn]}>
              {keepSignedIn ? <Icon name="check" size={12} color={colors.white} /> : null}
            </View>
            <AppText size={12}>로그인 상태 유지</AppText>
          </Pressable>
          {/* TODO(A4): 비밀번호 찾기 — 디자인 화면 없음, 범위 결정 필요 */}
          <AppText size={12} weight="500" color={colors.primary}>
            비밀번호 찾기
          </AppText>
        </View>

        <Button title="로그인" onPress={onSubmit} loading={loading} />

        <View style={styles.badge}>
          <Icon name="graduation-cap" size={16} color={colors.warmDark} />
          <AppText size={11} color={colors.warmDark}>
            학생 인증을 완료하면 더 안심하고 이용할 수 있어요
          </AppText>
        </View>

        {__DEV__ && !isSupabaseConfigured ? (
          <Button title="개발용으로 둘러보기 (Supabase 없이)" variant="soft" size="md" onPress={enterDevMode} />
        ) : null}

        <View style={styles.spacer} />

        <View style={styles.signupRow}>
          <AppText size={13}>계정이 없으신가요?</AppText>
          <Link href="/signup" asChild>
            <Pressable>
              <AppText size={13} weight="700" color={colors.primary}>
                회원가입
              </AppText>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1 },
  header: { alignItems: 'center', gap: 10 },
  deco: { position: 'absolute', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  decoPencil: { left: 22, top: 40, backgroundColor: colors.warm, transform: [{ rotate: '-8deg' }] },
  decoBook: { right: 30, bottom: 53, backgroundColor: colors.white, transform: [{ rotate: '10deg' }] },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.warm,
    borderWidth: 2,
    borderColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, paddingTop: 28, paddingHorizontal: 24, paddingBottom: 24, gap: 20 },
  fields: { gap: 12 },
  fieldRow: { flexDirection: 'row' },
  rememberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rememberLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.warmSoft,
  },
  spacer: { flex: 1 },
  signupRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
