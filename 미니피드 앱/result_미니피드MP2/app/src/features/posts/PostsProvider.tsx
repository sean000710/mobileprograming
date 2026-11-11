import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/shared/lib/supabase';
import type { Post } from './types';

type PostRow = {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
};

type PostsContextValue = {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  submitting: boolean;
  error: string | null;
  addPost: (content: string) => Promise<Post>;
  refreshPosts: () => Promise<void>;
  getPost: (id: string) => Post | undefined;
};

const PostsContext = createContext<PostsContextValue | null>(null);

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    authorId: row.author_id,
    nickname: `익명 ${row.author_id.slice(0, 4).toUpperCase()}`,
    content: row.content,
    createdAt: row.created_at,
  };
}

function getErrorMessage(error: unknown, action: 'load' | 'write') {
  if (error instanceof Error && error.message === 'SUPABASE_NOT_CONFIGURED') {
    return 'Supabase 설정이 필요합니다. .env 파일의 URL과 Publishable Key를 확인해 주세요.';
  }
  return action === 'load'
    ? '게시글을 불러오지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.'
    : '게시글을 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
}

export function PostsProvider({ children }: PropsWithChildren) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      return sessionData.session.user.id;
    }

    const { data, error: signInError } = await client.auth.signInAnonymously();
    if (signInError) throw signInError;
    if (!data.user) throw new Error('익명 사용자 생성에 실패했습니다.');

    userIdRef.current = data.user.id;
    return data.user.id;
  }, [requireClient]);

  const fetchPosts = useCallback(async () => {
    const client = requireClient();
    if (!userIdRef.current) await ensureAnonymousSession();

    const { data, error: queryError } = await client
      .from('posts')
      .select('id, author_id, content, created_at')
      .order('created_at', { ascending: false });

    if (queryError) throw queryError;
    setPosts(((data ?? []) as PostRow[]).map(toPost));
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
        const post = toPost(data as PostRow);
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

  const value = useMemo(
    () => ({ posts, loading, refreshing, submitting, error, addPost, refreshPosts, getPost }),
    [posts, loading, refreshing, submitting, error, addPost, refreshPosts, getPost],
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts는 PostsProvider 안에서만 사용할 수 있습니다.');
  return context;
}
