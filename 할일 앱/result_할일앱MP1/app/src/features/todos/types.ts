// 할 일 한 개의 모양
export interface Todo {
  id: string; // 고유 값. 예) "todo-1731200000000-0"
  title: string; // 할 일 내용 (앞뒤 공백 제거, 최대 50자)
  done: boolean; // 완료 여부
  createdAt: string; // 만든 시각 (ISO 문자열)
}
