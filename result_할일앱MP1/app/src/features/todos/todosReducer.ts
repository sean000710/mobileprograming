// 할 일 목록을 바꾸는 규칙을 한 곳에 모은 순수 함수.
// 화면과 분리돼 있어서 MP2에서 저장 기능을 붙일 때 이 결과만 저장하면 돼요.
import type { Todo } from './types';

export const TITLE_MAX = 50;

export type TodoAction =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string };

let seq = 0;

export function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add': {
      const title = action.title.trim().slice(0, TITLE_MAX);
      if (!title) return state; // 공백만 입력하면 추가하지 않아요
      const todo: Todo = {
        id: `todo-${Date.now()}-${seq++}`,
        title,
        done: false,
        createdAt: new Date().toISOString(),
      };
      return [todo, ...state]; // 새 할 일은 목록 맨 위에
    }
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case 'remove':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}
