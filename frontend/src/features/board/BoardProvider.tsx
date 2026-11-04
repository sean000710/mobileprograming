// 지금 보고 있는 게시판(우리 학교 / 지역 / 학부모)을 앱 전체에 공유합니다.
// 화면에서는 `const { boardType, setBoardType } = useBoard();`
import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import type { BoardType } from '@/types/models';

export const BOARD_LABELS: Record<BoardType, string> = {
  SCHOOL: '우리 학교 게시판',
  REGION: '지역 학교 게시판',
  PARENT: '학부모 게시판',
};

type BoardContextValue = {
  boardType: BoardType;
  // 아직 한 번도 고르지 않았으면 false → 홈 대신 게시판 선택 화면을 먼저 보여줍니다
  hasSelected: boolean;
  setBoardType: (type: BoardType) => void;
};

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: PropsWithChildren) {
  // TODO(B1): 마지막으로 고른 게시판 기억하기 (BOARD-09) — AsyncStorage 또는 users.default_board_type
  const [boardType, setBoardTypeState] = useState<BoardType>('SCHOOL');
  const [hasSelected, setHasSelected] = useState(false);
  const value = useMemo(
    () => ({
      boardType,
      hasSelected,
      setBoardType: (type: BoardType) => {
        setBoardTypeState(type);
        setHasSelected(true);
      },
    }),
    [boardType, hasSelected],
  );
  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard 는 BoardProvider 안에서만 사용할 수 있어요.');
  return ctx;
}
