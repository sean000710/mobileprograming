// 할 일 목록을 앱 전체에서 같이 쓰는 저장소.
// 지금은 앱 메모리에만 있어서, 앱을 완전히 껐다 켜면 빈 목록으로 돌아갑니다. (저장은 MP2)
import { createContext, PropsWithChildren, useContext, useMemo, useReducer } from 'react';

import { todosReducer } from './todosReducer';
import type { Todo } from './types';

type TodosContextValue = {
  todos: Todo[]; // 최신 할 일이 맨 앞
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
};

const TodosContext = createContext<TodosContextValue | null>(null);

export function TodosProvider({ children }: PropsWithChildren) {
  const [todos, dispatch] = useReducer(todosReducer, []);

  const value = useMemo<TodosContextValue>(
    () => ({
      todos,
      addTodo: (title) => dispatch({ type: 'add', title }),
      toggleTodo: (id) => dispatch({ type: 'toggle', id }),
      removeTodo: (id) => dispatch({ type: 'remove', id }),
    }),
    [todos],
  );

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error('useTodos 는 TodosProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
