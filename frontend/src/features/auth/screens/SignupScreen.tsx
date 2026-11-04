// A2. 회원가입 화면 (+ A3 학교 찾기)
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { isValidPhone, signUpWithPhone } from '@/features/auth/api';
import { SchoolSearchModal } from '@/features/auth/components/SchoolSearchModal';
import { AppText, Button, GradientHeader, Icon, TextField } from '@/shared/ui';
import { colors } from '@/shared/theme';
import type { School } from '@/types/models';

export default function SignupScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState<School | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // TODO(A2): 필드별 오류 표시 (AUTH-SIGNUP-03), 비밀번호 정책 확정 후 검증 추가
    if (!phone || !password || !school) return setError('전화번호, 비밀번호, 학교를 모두 입력해 주세요.');
    if (!isValidPhone(phone)) return setError('전화번호 형식을 확인해 주세요.');

    setLoading(true);
    setError(null);
    const result = await signUpWithPhone({ phone, password, schoolId: school.id });
    setLoading(false);

    if (!result.ok) return setError(result.message);
    Alert.alert('가입 완료', '잼타에 오신 걸 환영해요!');
    router.back();
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <GradientHeader style={styles.header}>
        <Pressable accessibilityLabel="뒤로가기" style={styles.back} onPress={() => router.back()}>
          <Icon name="arrow-left" size={18} color={colors.white} />
        </Pressable>
        <AppText jua size={24} color={colors.white}>
          회원가입
        </AppText>
        <AppText size={13} color={colors.primarySoft}>
          잼타와 함께 학교 친구들을 만나보세요
        </AppText>
      </GradientHeader>

      <View style={styles.body}>
        <AppText size={13} weight="500">
          기본 정보를 입력해주세요
        </AppText>

        <View style={styles.fields}>
          <View style={styles.row}>
            <TextField
              icon="phone"
              placeholder="전화번호"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={13}
            />
          </View>
          <View style={styles.row}>
            <TextField icon="lock" placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
          </View>
          {/* 학교는 직접 입력하지 않고 "찾기"로 선택해요 (AUTH-SIGNUP-07 정책 확정 시 변경) */}
          <View style={styles.schoolRow}>
            <Pressable style={styles.flex} onPress={() => setSearchOpen(true)}>
              <View pointerEvents="none" style={styles.row}>
                <TextField icon="school" placeholder="학교 이름" value={school?.name ?? ''} editable={false} />
              </View>
            </Pressable>
            <Button title="찾기" icon="search" variant="warm" size="md" onPress={() => setSearchOpen(true)} />
          </View>
        </View>

        <View style={styles.hint}>
          <Icon name="info" size={15} color={colors.primary} />
          <AppText size={11} color={colors.primary} style={styles.flex}>
            학교 찾기로 정확한 학교를 선택하면 인증이 더 빨라져요
          </AppText>
        </View>

        {error ? (
          <AppText size={12} color={colors.error}>
            {error}
          </AppText>
        ) : null}

        <Button title="회원가입" variant="gradient" onPress={onSubmit} loading={loading} />

        <View style={styles.spacer} />

        <View style={styles.loginRow}>
          <AppText size={13}>이미 계정이 있으신가요?</AppText>
          <Link href="/login" asChild>
            <Pressable>
              <AppText size={13} weight="700" color={colors.primary}>
                로그인
              </AppText>
            </Pressable>
          </Link>
        </View>
      </View>

      <SchoolSearchModal
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(s) => {
          setSchool(s);
          setSearchOpen(false);
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1 },
  header: { gap: 6 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF29',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, paddingTop: 28, paddingHorizontal: 24, paddingBottom: 24, gap: 18 },
  fields: { gap: 12 },
  row: { flexDirection: 'row' },
  schoolRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  spacer: { flex: 1 },
  loginRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
