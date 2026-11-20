import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/shared/lib/supabase';
import type { Comment, Post, ReportReason } from './types';

// posts 조회 결과 한 줄. post_likes / comments 는 집계용으로 함께 가져와요.
type PostRow = {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  post_likes: { user_id: string }[] | null;
  comments: { count: number }[] | null;
};

type CommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
};

type ErrorAction = 'load' | 'write' | 'like' | 'comment' | 'report';

type PostsContextValue = {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  submitting: boolean;
  error: string | null;
  userId: string | null; // 현재 익명 사용자 ID
  addPost: (content: string) => Promise<Post>;
  refreshPosts: () => Promise<void>;
  getPost: (id: string) => Post | undefined;
  toggleLike: (postId: string) => Promise<void>;
  fetchComments: (postId: string) => Promise<Comment[]>;
  addComment: (postId: string, content: string) => Promise<Comment>;
  reportPost: (postId: string, reason: ReportReason, detail?: string) => Promise<boolean>;
  refreshPost: (postId: string) => Promise<void>;
};

const PostsContext = createContext<PostsContextValue | null>(null);

// 게시글 select 문: 좋아요(누가 눌렀는지) + 댓글 수를 함께 가져옵니다.
const POST_SELECT = 'id, author_id, content, created_at, post_likes(user_id), comments(count)';

function nicknameOf(userId: string) {
  return `익명 ${userId.slice(0, 4).toUpperCase()}`;
}

function toPost(row: PostRow, myUserId: string | null): Post {
  const likes = row.post_likes ?? [];
  return {
    id: row.id,
    authorId: row.author_id,
    nickname: nicknameOf(row.author_id),
    content: row.content,
    createdAt: row.created_at,
    likeCount: likes.length,
    commentCount: row.comments?.[0]?.count ?? 0,
    likedByMe: Boolean(myUserId) && likes.some((like) => like.user_id === myUserId),
  };
}

function toComment(row: CommentRow): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    nickname: nicknameOf(row.author_id),
    content: row.content,
    createdAt: row.created_at,
  };
}

function getErrorMessage(error: unknown, action: ErrorAction) {
  if (error instanceof Error && error.message === 'SUPABASE_NOT_CONFIGURED') {
    return 'Supabase 설정이 필요합니다. .env 파일의 URL과 Publishable Key를 확인해 주세요.';
  }
  switch (action) {
    case 'load':
      return '게시글을 불러오지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
    case 'write':
      return '게시글을 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
    case 'like':
      return '좋아요를 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
    case 'comment':
      return '댓글을 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
    case 'report':
      return '신고를 접수하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
  }
}

export function PostsProvider({ children }: PropsWithChildren) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);

  const requireClient = useCallback(() => {
    if (!isSupabaseConfigured || !supabase) throw new Error('SUPABASE_NOT_CONFIGURED');
    return supabase;
  }, []);

  const ensureAnonymousSession = useCallback(async () => {
    const client = requireClient();
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;

    if (sessionData.session?.user.id) {
      userIdRef.current = sessionData.session.user.id;
      setUserId(sessionData.session.user.id);
      return sessionData.session.user.id;
    }

    const { data, error: signInError } = await client.auth.signInAnonymously();
    if (signInError) throw signInError;
    if (!data.user) throw new Error('익명 사용자 생성에 실패했습니다.');

    userIdRef.current = data.user.id;
    setUserId(data.user.id);
    return data.user.id;
  }, [requireClient]);

  const fetchPosts = useCallback(async () => {
    const client = requireClient();
    if (!userIdRef.current) await ensureAnonymousSession();

    const { data, error: queryError } = await client
      .from('posts')
      .select(POST_SELECT)
      .order('created_at', { ascending: false });

    if (queryError) throw queryError;
    setPosts(((data ?? []) as unknown as PostRow[]).map((row) => toPost(row, userIdRef.current)));
  }, [ensureAnonymousSession, requireClient]);

  const refreshPosts = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await fetchPosts();
    } catch (refreshError) {
      setError(getErrorMessage(refreshError, 'load'));
    } finally {
      setRefreshing(false);
    }
  }, [fetchPosts]);

  useEffect(() => {
    let active = true;

    async function initialize() {
      setLoading(true);
      setError(null);
      try {
        await ensureAnonymousSession();
        if (active) await fetchPosts();
      } catch (initializeError) {
        if (active) setError(getErrorMessage(initializeError, 'load'));
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();
    return () => {
      active = false;
    };
  }, [ensureAnonymousSession, fetchPosts]);

  const addPost = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) throw new Error('EMPTY_POST');

      setSubmitting(true);
      setError(null);
      try {
        const client = requireClient();
        const authorId = userIdRef.current ?? (await ensureAnonymousSession());
        const { data, error: insertError } = await client
          .from('posts')
          .insert({ author_id: authorId, content: trimmed })
          .select('id, author_id, content, created_at')
          .single();

        if (insertError) throw insertError;
        const post: Post = {
          ...toPost({ ...(data as Omit<PostRow, 'post_likes' | 'comments'>), post_likes: [], comments: [] }, authorId),
        };
        setPosts((current) => [post, ...current.filter((item) => item.id !== post.id)]);
        return post;
      } catch (writeError) {
        setError(getErrorMessage(writeError, 'write'));
        throw writeError;
      } finally {
        setSubmitting(false);
      }
    },
    [ensureAnonymousSession, requireClient],
  );

  const getPost = useCallback((id: string) => posts.find((post) => post.id === id), [posts]);

  // 좋아요 토글: 화면을 먼저 바꾸고(낙관적 업데이트) 서버에 저장해요. 실패하면 되돌립니다.
  const toggleLike = useCallback(
    async (postId: string) => {
      const client = requireClient();
      const myUserId = userIdRef.current ?? (await ensureAnonymousSession());
      const target = posts.find((post) => post.id === postId);
      if (!target) return;

      const nextLiked = !target.likedByMe;
      const applyLike = (liked: boolean) =>
        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByMe: liked,
                  likeCount: Math.max(0, post.likeCount + (liked ? 1 : -1)),
                }
              : post,
          ),
        );

      setError(null);
      applyLike(nextLiked);

      try {
        if (nextLiked) {
          const { error: insertError } = await client
            .from('post_likes')
            .insert({ post_id: postId, user_id: myUserId });
          // 23505 = 이미 좋아요를 누른 상태(중복). 이미 눌린 것으로 보고 성공 처리해요.
          if (insertError && insertError.code !== '23505') throw insertError;
        } else {
          const { error: deleteError } = await client
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', myUserId);
          if (deleteError) throw deleteError;
        }
      } catch (likeError) {
        applyLike(target.likedByMe); // 원상복구
        setError(getErrorMessage(likeError, 'like'));
      }
    },
    [ensureAnonymousSession, posts, requireClient],
  );

  const fetchComments = useCallback(
    async (postId: string) => {
      const client = requireClient();
      if (!userIdRef.current) await ensureAnonymousSession();

      const { data, error: queryError } = await client
        .from('comments')
        .select('id, post_id, author_id, content, created_at')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (queryError) throw queryError;
      return ((data ?? []) as CommentRow[]).map(toComment);
    },
    [ensureAnonymousSession, requireClient],
  );

  const addComment = useCallback(
    async (postId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) throw new Error('EMPTY_COMMENT');

      const client = requireClient();
      const authorId = userIdRef.current ?? (await ensureAnonymousSession());
      const { data, error: insertError } = await client
        .from('comments')
        .insert({ post_id: postId, author_id: authorId, content: trimmed })
        .select('id, post_id, author_id, content, created_at')
        .single();

      if (insertError) {
        setError(getErrorMessage(insertError, 'comment'));
        throw insertError;
      }

      const comment = toComment(data as CommentRow);
      setPosts((current) =>
        current.map((post) =>
          post.id === postId ? { ...post, commentCount: post.commentCount + 1 } : post,
        ),
      );
      return comment;
    },
    [ensureAnonymousSession, requireClient],
  );

  const reportPost = useCallback(
    async (postId: string, reason: ReportReason, detail?: string) => {
      const client = requireClient();
      const reporterId = userIdRef.current ?? (await ensureAnonymousSession());
      const trimmedDetail = detail?.trim();

      const { error: insertError } = await client.from('post_reports').insert({
        post_id: postId,
        reporter_id: reporterId,
        reason,
        detail: trimmedDetail ? trimmedDetail : null,
      });

      if (insertError) {
        setError(getErrorMessage(insertError, 'report'));
        throw insertError;
      }
      return true;
    },
    [ensureAnonymousSession, requireClient],
  );

  // 상세 화면 동기화: 게시글 한 개만 서버에서 다시 읽어 목록의 해당 항목을 교체해요.
  const refreshPost = useCallback(
    async (postId: string) => {
      const client = requireClient();
      if (!userIdRef.current) await ensureAnonymousSession();

      const { data, error: queryError } = await client
        .from('posts')
        .select(POST_SELECT)
        .eq('id', postId)
        .maybeSingle();

      if (queryError) throw queryError;
      if (!data) return;

      const fresh = toPost(data as unknown as PostRow, userIdRef.current);
      setPosts((current) =>
        current.some((post) => post.id === postId)
          ? current.map((post) => (post.id === postId ? fresh : post))
          : [fresh, ...current],
      );
    },
    [ensureAnonymousSession, requireClient],
  );

  const value = useMemo(
    () => ({
      posts,
      loading,
      refreshing,
      submitting,
      error,
      userId,
      addPost,
      refreshPosts,
      getPost,
      toggleLike,
      fetchComments,
      addComment,
      reportPost,
      refreshPost,
    }),
    [
      posts,
      loading,
      refreshing,
      submitting,
      error,
      userId,
      addPost,
      refreshPosts,
      getPost,
      toggleLike,
      fetchComments,
      addComment,
      reportPost,
      refreshPost,
    ],
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts는 PostsProvider 안에서만 사용할 수 있습니다.');
  return context;
}
