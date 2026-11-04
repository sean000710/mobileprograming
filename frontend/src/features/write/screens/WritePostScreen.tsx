// E. 글쓰기 (E1 게시, E2 글자 수, E3 사진 첨부) + F1/F2 안내 모달
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useBoard } from '@/features/board/BoardProvider';
import { CONTENT_MAX, IMAGE_MAX, TITLE_MAX, WriteFailReason, createPost } from '@/features/write/api';
import { AppModal, AppText, Button, Icon, Screen, TopBar } from '@/shared/ui';
import { colors, fonts } from '@/shared/theme';

export default function WritePostScreen() {
  const { boardType } = useBoard();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUris] = useState<string[]>([]); // TODO(E3): expo-image-picker 로 사진 고르기 (최대 5장)
  const [submitting, setSubmitting] = useState(false);
  const [failReason, setFailReason] = useState<WriteFailReason | null>(null);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const onSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const result = await createPost({
      boardType,
      title: title.trim(),
      content: content.trim(),
      isAnonymous: true, // TODO(I3): 마이페이지 "익명으로 표시하기" 설정값 사용
      imageUris,
    });
    setSubmitting(false);
    if (!result.ok) return setFailReason(result.reason);
    // TODO(E1): 피드 최상단에 새 글이 보이도록 피드 새로고침 (WRITE-01)
    router.back();
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
            style={styles.titleField}
            placeholder="제목을 입력하세요"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={TITLE_MAX}
          />

          <View style={styles.contentColumn}>
            <TextInput
              style={styles.contentBox}
              placeholder="내용을 입력하세요"
              placeholderTextColor={colors.textSecondary}
              value={content}
              onChangeText={setContent}
              maxLength={CONTENT_MAX}
              multiline
              textAlignVertical="top"
            />
            <AppText size={11} weight="500" style={styles.counter}>
              {content.length} / {CONTENT_MAX}
            </AppText>
          </View>

          <View style={styles.photoField}>
            <View style={styles.photoHeader}>
              <AppText size={13} weight="700">
                사진 첨부
              </AppText>
              <AppText size={11} weight="500">
                {imageUris.length} / {IMAGE_MAX}
              </AppText>
            </View>
            <View style={styles.photoRow}>
              {imageUris.map((uri) => (
                <Image key={uri} source={uri} style={styles.photoButton} contentFit="cover" />
              ))}
              {imageUris.length < IMAGE_MAX ? (
                <Pressable accessibilityLabel="사진 첨부" style={styles.photoButton}>
                  <Icon name="image-plus" size={22} color={colors.textSecondary} />
                </Pressable>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* F2. 부적절한 내용 */}
      <AppModal
        visible={failReason === 'INAPPROPRIATE'}
        icon="shield-x"
        tone="error"
        title="부적절한 내용이 포함되어 게시할 수 없습니다"
        message="욕설, 비방, 개인정보 노출 등 커뮤니티 이용 규칙을 확인한 뒤 다시 작성해주세요"
        primaryText="다시 작성하기"
        onPrimary={() => setFailReason(null)} // 입력한 제목/내용은 그대로 유지 (GUARD-12)
      />
      {/* F1. 게시 순간에 서버가 횟수 제한으로 거부한 경우 */}
      <AppModal
        visible={failReason === 'RATE_LIMIT'}
        icon="circle-alert"
        tone="error"
        title="게시글 작성 횟수를 초과했습니다"
        message="단시간 안에 여러 게시물을 작성 할 수 없어요. 잠시후 다시 시도하세요."
        primaryText="확인했어요"
        onPrimary={() => setFailReason(null)}
      />
      <AppModal
        visible={failReason === 'UNKNOWN'}
        icon="cloud-off"
        title="게시하지 못했어요"
        message="잠시 후 다시 시도해 주세요."
        primaryText="확인"
        onPrimary={() => setFailReason(null)}
      />
    </Screen>
  );
}

const fieldBox = {
  backgroundColor: colors.surface,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: colors.border,
  color: colors.text,
} as const;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { gap: 20, padding: 20 },
  titleField: { ...fieldBox, paddingVertical: 14, paddingHorizontal: 16, fontFamily: fonts.semibold, fontSize: 15 },
  contentColumn: { gap: 6 },
  contentBox: { ...fieldBox, height: 160, paddingVertical: 14, paddingHorizontal: 16, fontFamily: fonts.regular, fontSize: 14 },
  counter: { textAlign: 'right' },
  photoField: { gap: 10 },
  photoHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  photoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoButton: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
