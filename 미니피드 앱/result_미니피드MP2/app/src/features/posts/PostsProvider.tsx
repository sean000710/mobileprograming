import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { minutesAgo } from '@/shared/lib/time';
import type { Post } from './types';

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

// 서버 없이 앱 안에서만 쓰는 예시 데이터 (앱을 끄면 새 글은 사라짐)
const LOCAL_AUTHOR_ID = 'local-user';

const SEED_POSTS: Post[] = [
  {
    id: 'seed-1',
    authorId: 'seed-a',
    nickname: '익명 AAAA',
    content: '체육대회 언제 시작하나요?? 다들 몇 시까지 오는지 아시는 분?',
    createdAt: minutesAgo(5),
  },
  {
    id: 'seed-2',
    authorId: 'seed-b',
    nickname: '익명 BBBB',
    content: '급식 오늘 진짜 맛있었다 ㅋㅋ\n돈까스 나온 날은 항상 줄이 길어요 ㅠㅠ',
    createdAt: minutesAgo(32),
  },
  {
    id: 'seed-3',
    authorId: 'seed-c',
    nickname: '익명 CCCC',
    content: '동아리 신입 부원 모집합니다. 관심 있으신 분들 댓글 남겨주세요!',
    createdAt: minutesAgo(120),
  },
];

export function PostsProvider({ children }: PropsWithChildren) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [refreshing, setRefreshing] = useState(false);

  const refreshPosts = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setRefreshing(false);
  }, []);

  const addPost = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) throw new Error('EMPTY_POST');

    const post: Post = {
      id: `post-${Date.now()}`,
      authorId: LOCAL_AUTHOR_ID,
      nickname: '익명 나',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setPosts((current) => [post, ...current]);
    return post;
  }, []);

  const getPost = useCallback((id: string) => posts.find((post) => post.id === id), [posts]);

  const value = useMemo(
    () => ({ posts, loading: false, refreshing, submitting: false, error: null, addPost, refreshPosts, getPost }),
    [posts, refreshing, addPost, refreshPosts, getPost],
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) throw new Error('usePosts는 PostsProvider 안에서만 사용할 수 있습니다.');
  return context;
}
