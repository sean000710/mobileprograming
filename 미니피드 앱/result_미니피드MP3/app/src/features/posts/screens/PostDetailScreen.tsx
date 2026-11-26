// 게시글 상세: 본문 + 좋아요/댓글 수 + 댓글 목록 + 댓글 입력창 + 신고 모달
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePosts } from '@/features/posts/PostsProvider';
import type { Comment, ReportReason } from '@/features/posts/types';
import { formatRelativeTime, useNow } from '@/shared/lib/time';
import { AppText, Button, EmptyState, Icon, IconBadge, Screen, TopBar } from '@/shared/ui';
import { colors, fonts } from '@/shared/theme';

const COMMENT_MAX = 500;
const DETAIL_MAX = 300;

// 신고 사유 5가지 (서버의 reason 값과 1:1)
const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: '스팸/광고' },
  { value: 'abuse', label: '욕설·비방' },
  { value: 'sexual', label: '성적 콘텐츠' },
  { value: 'illegal', label: '불법 정보' },
  { value: 'other', label: '기타' },
];

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PostDetail key={id} id={id} />;
}

function PostDetail({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const { getPost, refreshPost, fetchComments, addComment, toggleLike, reportPost, error } = usePosts();
  const now = useNow();
  const post = getPost(id);

  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState('');
  const [reporting, setReporting] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportDone, setReportDone] = useState(false);

  // 진입할 때마다 서버에서 최신 게시글 + 댓글을 다시 읽어요.
  useEffect(() => {
    let active = true;
    refreshPost(id).catch(() => {
      // 목록에 이미 있는 값으로 계속 보여줘요.
    });
    fetchComments(id).then((items) => {
      if (active) setComments(items);
    }).catch(() => {
      if (active) {
        setComments([]);
        setCommentError('댓글을 불러오지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.');
      }
    });
    return () => {
      active = false;
    };
  }, [id, fetchComments, refreshPost]);

  const canSend = comments !== null && commentText.trim().length > 0 && !sending;

  const onSendComment = async () => {
    if (!canSend) return; // 빈 댓글은 보내지 않아요
    setSending(true);
    setCommentError(null);
    try {
      const created = await addComment(id, commentText);
      setComments((current) => [...(current ?? []), created]);
      setCommentText('');
    } catch {
      setCommentError('댓글을 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.');
    } finally {
      setSending(false);
    }
  };

  const openReport = () => {
    setReason(null);
    setDetail('');
    setReportError(null);
    setReportOpen(true);
  };

  const onSubmitReport = async () => {
    if (!reason) return; // 사유를 고르기 전에는 신고할 수 없어요
    setReporting(true);
    setReportError(null);
    try {
      await reportPost(id, reason, detail);
      setReportOpen(false);
      setReportDone(true);
    } catch {
      setReportError('신고를 접수하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.');
    } finally {
      setReporting(false);
    }
  };

  return (
    <Screen>
      <TopBar
        title="게시물"
        showBack
        right={
          post ? (
            <Pressable accessibilityRole="button" accessibilityLabel="신고" hitSlop={8} onPress={openReport} style={styles.flagButton}>
              <Icon name="flag" size={18} color={colors.textSecondary} />
            </Pressable>
          ) : undefined
        }
      />

      {post ? (
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <IconBadge name="user" size={40} iconSize={18} />
              <View style={styles.names}>
                <AppText size={14} weight="700">
                  {post.nickname}
                </AppText>
                <AppText size={11}>{formatRelativeTime(post.createdAt, now)}</AppText>
              </View>
            </View>

            <AppText size={15} style={styles.content}>
              {post.content}
            </AppText>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={post.likedByMe ? '좋아요 취소' : '좋아요'}
                disabled={post.likePending}
                hitSlop={8}
                onPress={() => toggleLike(post.id)}
                style={styles.action}>
                <Icon
                  name="heart"
                  size={18}
                  color={post.likedByMe ? colors.like : colors.textSecondary}
                  fill={post.likedByMe ? colors.like : 'none'}
                />
                <AppText size={13} weight={post.likedByMe ? '700' : 'normal'} color={post.likedByMe ? colors.like : colors.textSecondary}>
                  좋아요 {post.likeCount}
                </AppText>
              </Pressable>
              <View style={styles.action}>
                <Icon name="message-circle" size={18} color={colors.textSecondary} />
                <AppText size={13} color={colors.textSecondary}>
                  댓글 {post.commentCount}
                </AppText>
              </View>
            </View>

            {error ? (
              <AppText size={12} color={colors.error} style={styles.errorText}>
                {error}
              </AppText>
            ) : null}

            <View style={styles.divider} />

            <AppText size={13} weight="700">
              댓글 {post.commentCount}
            </AppText>

            {comments === null ? (
              <View style={styles.commentsLoading}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : comments.length === 0 ? (
              <AppText variant="caption" style={styles.emptyComments}>
                첫 댓글을 남겨보세요
              </AppText>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.comment}>
                  <View style={styles.commentHeader}>
                    <AppText size={12} weight="700">
                      {comment.nickname}
                    </AppText>
                    <AppText size={10}>{formatRelativeTime(comment.createdAt, now)}</AppText>
                  </View>
                  <AppText size={13} style={styles.commentContent}>
                    {comment.content}
                  </AppText>
                </View>
              ))
            )}

            {commentError ? (
              <AppText size={12} color={colors.error} style={styles.errorText}>
                {commentError}
              </AppText>
            ) : null}
          </ScrollView>

          {/* 하단 고정 댓글 입력창 */}
          <View style={[styles.composer, { paddingBottom: 12 + insets.bottom }]}>
            <TextInput
              style={styles.input}
              placeholder="댓글을 남겨보세요"
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              maxLength={COMMENT_MAX}
              multiline
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="댓글 보내기"
              disabled={!canSend}
              onPress={onSendComment}
              style={[styles.sendButton, !canSend && styles.sendDisabled]}>
              {sending ? (
                <ActivityIndicator color={colors.white} size="small" />
              ) : (
                <Icon name="send" size={16} color={colors.white} />
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <EmptyState message="존재하지 않는 게시물이에요." />
      )}

      {/* 신고 모달 */}
      <Modal visible={reportOpen} transparent animationType="fade" onRequestClose={() => setReportOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <AppText jua size={16}>
                게시물 신고
              </AppText>
              <Pressable accessibilityRole="button" accessibilityLabel="닫기" hitSlop={8} onPress={() => setReportOpen(false)}>
                <Icon name="x" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <AppText variant="caption">신고 사유를 선택해 주세요.</AppText>

            <View style={styles.reasonList}>
              {REPORT_REASONS.map((item) => {
                const selected = reason === item.value;
                return (
                  <Pressable
                    key={item.value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() => setReason(item.value)}
                    style={[styles.reasonRow, selected && styles.reasonRowSelected]}>
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected ? <Icon name="check" size={11} color={colors.white} /> : null}
                    </View>
                    <AppText size={13} weight={selected ? '700' : 'normal'}>
                      {item.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              style={styles.detailInput}
              placeholder="추가 설명 (선택)"
              placeholderTextColor={colors.textSecondary}
              value={detail}
              onChangeText={setDetail}
              maxLength={DETAIL_MAX}
              multiline
              textAlignVertical="top"
            />
            <AppText variant="small" style={styles.counter}>
              {detail.length}/{DETAIL_MAX}
            </AppText>

            {reportError ? (
              <AppText size={12} color={colors.error} style={styles.errorText}>
                {reportError}
              </AppText>
            ) : null}

            <Button title="신고하기" onPress={onSubmitReport} disabled={!reason} loading={reporting} />
          </View>
        </View>
      </Modal>

      {/* 신고 접수 안내 */}
      <Modal visible={reportDone} transparent animationType="fade" onRequestClose={() => setReportDone(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, styles.doneCard]}>
            <IconBadge name="check" size={44} iconSize={20} bg={colors.primarySoft} />
            <AppText size={14} weight="700">
              신고가 접수되었습니다
            </AppText>
            <AppText variant="caption" style={styles.doneText}>
              검토 후 운영 기준에 따라 조치할게요.
            </AppText>
            <Button title="확인" onPress={() => setReportDone(false)} style={styles.doneButton} />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { gap: 16, padding: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  names: { gap: 2 },
  content: { lineHeight: 24 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  divider: { height: 1, backgroundColor: colors.border },
  commentsLoading: { paddingVertical: 24, alignItems: 'center' },
  emptyComments: { paddingVertical: 24, textAlign: 'center' },
  comment: { gap: 4, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentContent: { lineHeight: 20 },
  errorText: { lineHeight: 18 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 96,
    minHeight: 42,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: { opacity: 0.4 },
  flagButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    gap: 12,
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reasonList: { gap: 8 },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reasonRowSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  detailInput: {
    minHeight: 72,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  counter: { textAlign: 'right', marginTop: -6 },
  doneCard: { alignItems: 'center', gap: 10 },
  doneText: { textAlign: 'center' },
  doneButton: { alignSelf: 'stretch', marginTop: 4 },
});
