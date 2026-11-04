// D. 게시물 상세 (D1 본문, D2 좋아요, D3 댓글, D4 댓글 좋아요, D5 삭제된 글)
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { addComment, getComments, getPostDetail, toggleCommentLike, togglePostLike } from '@/features/post/api';
import { CommentItem } from '@/features/post/components/CommentItem';
import { useAsync } from '@/shared/lib/useAsync';
import { AppText, EmptyState, Icon, LoadingState, MessageInput, PostMeta, Screen, TopBar } from '@/shared/ui';
import { colors } from '@/shared/theme';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = useAsync(() => getPostDetail(id), [id]);
  const comments = useAsync(() => getComments(id), [id]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const onToggleLike = async () => {
    if (!post.data) return;
    const { liked } = await togglePostLike(post.data.id, post.data.likedByMe);
    post.setData((prev) => (prev ? { ...prev, likedByMe: liked, likeCount: prev.likeCount + (liked ? 1 : -1) } : null));
  };

  const onToggleCommentLike = async (commentId: string, likedByMe: boolean) => {
    const { liked } = await toggleCommentLike(commentId, likedByMe);
    comments.setData((list = []) =>
      list.map((c) => (c.id === commentId ? { ...c, likedByMe: liked, likeCount: c.likeCount + (liked ? 1 : -1) } : c)),
    );
  };

  const onSend = async () => {
    const content = draft.trim();
    if (!content || sending) return; // 공백 댓글 차단 (POST-04)
    setSending(true);
    // TODO(D3): 부적절 내용으로 거부되면 안내 모달 (POST-05)
    const created = await addComment(id, content);
    comments.setData((list = []) => [...list, created]);
    setDraft('');
    setSending(false);
  };

  if (post.loading) return <LoadingState />;
  if (!post.data) {
    // TODO(D5): 안내 후 자동으로 목록 복귀
    return (
      <Screen>
        <TopBar title="게시물" showBack />
        <EmptyState icon="inbox" message="삭제되었거나 존재하지 않는 게시물이에요." />
      </Screen>
    );
  }

  const p = post.data;
  return (
    <Screen>
      <TopBar title="게시물" showBack />
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <AppText size={18} weight="700">
              {p.title}
            </AppText>
            <PostMeta schoolName={p.schoolName} authorName={p.authorName} createdAt={p.createdAt} />
            <Pressable style={styles.likeRow} onPress={onToggleLike} accessibilityLabel="좋아요">
              <Icon name="heart" size={14} color={colors.like} filled={p.likedByMe} />
              <AppText size={12} weight="600">
                {p.likeCount}
              </AppText>
            </Pressable>
          </View>

          <View style={styles.divider} />
          <AppText size={14} style={styles.body}>
            {p.content}
          </AppText>
          {/* TODO(D1): p.imageUrls 사진 표시 */}

          <View style={styles.comments}>
            <AppText size={13} weight="700">
              댓글 {comments.data?.length ?? 0}개
            </AppText>
            {(comments.data ?? []).map((c, i) => (
              <CommentItem
                key={c.id}
                comment={c}
                index={i}
                onToggleLike={() => onToggleCommentLike(c.id, c.likedByMe)}
              />
            ))}
          </View>
        </ScrollView>

        <MessageInput showAvatar placeholder="댓글을 입력하세요" value={draft} onChangeText={setDraft} onSend={onSend} disabled={sending} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { gap: 18, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  header: { gap: 8 },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  divider: { height: 1, backgroundColor: colors.border },
  body: { lineHeight: 22 },
  comments: { gap: 14 },
});
