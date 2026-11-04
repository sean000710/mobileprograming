// 시간 표시 공통 함수 (J4). 화면마다 따로 만들지 말고 이걸 쓰세요.

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

// 쪽지 목록용: 하루 전은 "어제" (나머지는 formatRelativeTime 과 같아요)
export function formatMessageTime(iso: string, now: Date = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  return days === 1 ? '어제' : formatRelativeTime(iso, now);
}

// 채팅 말풍선용: "오후 3:12"
export function formatChatTime(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours < 12 ? '오전' : '오후';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${hour12}:${minutes}`;
}

// 목업 데이터 만들 때 쓰는 도우미: n분 전 시각의 ISO 문자열
export function minutesAgo(n: number): string {
  return new Date(Date.now() - n * 60_000).toISOString();
}
