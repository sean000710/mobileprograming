// 서버에서 데이터를 불러오는 화면에서 쓰는 공통 훅.
//
// 사용 예:
//   const { data, loading, error, reload } = useAsync(() => getPosts(boardType), [boardType]);
import { DependencyList, useCallback, useEffect, useState } from 'react';

type AsyncState<T> = {
  data: T | undefined;
  error: unknown;
  loading: boolean;
};

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: undefined, loading: true });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    fn().then(
      (data) => alive && setState({ data, error: undefined, loading: false }),
      (error: unknown) => alive && setState((prev) => ({ ...prev, error, loading: false })),
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
    setTick((t) => t + 1);
  }, []);

  // 화면에서 직접 값을 바꿀 때 (예: 좋아요 누른 직후 숫자 반영)
  const setData = useCallback((updater: (prev: T | undefined) => T) => {
    setState((prev) => ({ ...prev, data: updater(prev.data) }));
  }, []);

  return { ...state, reload, setData };
}
