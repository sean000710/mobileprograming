// 게시글 목록을 앱 전체에서 같이 쓰는 저장소.
// 글쓰기 화면에서 addPost 를 부르면 피드 화면의 목록 맨 앞에 바로 추가돼요.
// (지금은 앱 메모리에만 저장돼서, 앱을 완전히 껐다 켜면 예시 글 4개로 돌아갑니다.)
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { SEED_POSTS } from './seed';
import type { Post } from './types';

// 로그인이 없어서, 새 글의 작성자는 이 닉네임으로 고정이에요.
export const MY_NICKNAME = '열정만점잼타';

type PostsContextValue = {
  posts: Post[]; // 최신 글이 맨 앞
  addPost: (content: string) => Post;
  getPost: (id: string) => Post | undefined;
};

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: PropsWithChildren) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);

  const addPost = useCallback((content: string) => {
    const post: Post = {
      id: `post-${Date.now()}`,
      nickname: MY_NICKNAME,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]); // 맨 앞에 추가 = 피드 최상단
    return post;
  }, []);

  const getPost = useCallback((id: string) => posts.find((p) => p.id === id), [posts]);

  const value = useMemo(() => ({ posts, addPost, getPost }), [posts, addPost, getPost]);
  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts 는 PostsProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
