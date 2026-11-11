// 글쓰기: 내용을 쓰고 "게시"를 누르면 피드 맨 위에 추가되고 피드로 돌아가요.
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TextInput } from 'react-native';

import { usePosts } from '@/features/posts/PostsProvider';
import { Button, Screen, TopBar } from '@/shared/ui';
import { colors, fonts } from '@/shared/theme';

const CONTENT_MAX = 1000;

export default function WritePostScreen() {
  const { addPost } = usePosts();
  const [content, setContent] = useState('');
  const canSubmit = content.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) return; // 빈 글은 올리지 않아요
    addPost(content);
    router.back();
  };

  return (
    <Screen>
      <TopBar
        title="게시물 작성"
        showBack
        backIcon="x"
        centerTitle
        right={<Button title="게시" size="sm" onPress={onSubmit} disabled={!canSubmit} />}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { padding: 20 },
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
