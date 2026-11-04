// 글쓰기: 내용을 쓰고 "게시"를 누르면 피드 맨 위에 추가되고 피드로 돌아가요.
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { usePosts } from '@/features/posts/PostsProvider';
import { AppText, Button, Screen, TopBar } from '@/shared/ui';
import { colors, fonts } from '@/shared/theme';

const CONTENT_MAX = 1000;

export default function WritePostScreen() {
  const { addPost, submitting } = usePosts();
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canSubmit = content.trim().length > 0;

  const onSubmit = async () => {
    if (!canSubmit) return; // 빈 글은 올리지 않아요
    setErrorMessage(null);
    try {
      await addPost(content);
      router.back();
    } catch {
      setErrorMessage('게시글을 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.');
    }
  };

  return (
    <Screen>
      <TopBar
        title="게시물 작성"
        showBack
        backIcon="x"
        centerTitle
        right={<Button title="게시" size="sm" onPress={onSubmit} disabled={!canSubmit} loading={submitting} />}
      />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.input}
            placeholder="내용을 입력하세요"
            placeholderTextColor={colors.textSecondary}
            value={content}
            onChangeText={setContent}
            maxLength={CONTENT_MAX}
            multiline
            autoFocus
            textAlignVertical="top"
          />
          <View style={styles.meta}>
            {errorMessage ? (
              <AppText size={12} color={colors.error} style={styles.error}>
                {errorMessage}
              </AppText>
            ) : (
              <View />
            )}
            <AppText variant="small">
              {content.length}/{CONTENT_MAX}
            </AppText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: 20 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 8 },
  error: { flex: 1, lineHeight: 18 },
  input: {
    minHeight: 220,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
  },
});
