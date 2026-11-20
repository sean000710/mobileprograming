// 시간 표시 공통 함수.
import { useEffect, useState } from 'react';

// "방금 전", "5분 전", "3시간 전", "2일 전", 일주일이 넘으면 "9월 3일"
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const diffMs = Math.max(0, now.getTime() - new Date(iso).getTime());
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// n분 전 시각의 ISO 문자열 (예시 데이터 만들 때 사용)
export function minutesAgo(n: number): string {
  return new Date(Date.now() - n * 60_000).toISOString();
}

// 화면에 떠 있는 동안 30초마다 "지금 시각"을 갱신해요. "5분 전"이 저절로 "6분 전"으로 바뀌게 하는 용도.
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
}
