// 쪽지 / 채팅 서버 호출 (H1~H5)
import { delay } from '@/shared/lib/mock';
import { minutesAgo } from '@/shared/lib/time';
import type { Conversation, Message, MessageBox } from '@/types/models';

const SCHOOL = '잼타고등학교';

// 목업: .pen 의 받은 쪽지 / 보낸 쪽지 화면과 같은 내용
const RECEIVED: Conversation[] = [
  { id: 'cv1', partnerName: '김도윤', partnerSchool: SCHOOL, lastMessage: '안녕 급식 게시글 봤는데 나도 궁금해서!', lastMessageAt: minutesAgo(5), unread: true },
  { id: 'cv2', partnerName: '이하은', partnerSchool: SCHOOL, lastMessage: '동아리 지원하고 싶어요! 언제까지 받나요?', lastMessageAt: minutesAgo(60), unread: false },
  { id: 'cv3', partnerName: '박지민', partnerSchool: SCHOOL, lastMessage: '학교 축제 사진 더 있어? 보고싶다 ㅋㅋ', lastMessageAt: minutesAgo(180), unread: true },
  { id: 'cv4', partnerName: '최서연', partnerSchool: SCHOOL, lastMessage: '스터디 그룹 저도 참여 가능할까요?', lastMessageAt: minutesAgo(60 * 26), unread: false },
  { id: 'cv5', partnerName: '담당 선생님', partnerSchool: SCHOOL, lastMessage: '동아리 신청서 확인했습니다', lastMessageAt: minutesAgo(60 * 49), unread: false },
];

const SENT: Conversation[] = [
  { id: 'cv1', partnerName: '김도윤', partnerSchool: SCHOOL, lastMessage: '네 저도 급식 완전 좋아해요 ㅋㅋ', lastMessageAt: minutesAgo(3), unread: false },
  { id: 'cv2', partnerName: '이하은', partnerSchool: SCHOOL, lastMessage: '다음주까지 받고 있어요!', lastMessageAt: minutesAgo(50), unread: false },
  { id: 'cv3', partnerName: '박지민', partnerSchool: SCHOOL, lastMessage: '사진 앨범 정리해서 곧 올릴게요', lastMessageAt: minutesAgo(120), unread: false },
  { id: 'cv4', partnerName: '최서연', partnerSchool: SCHOOL, lastMessage: '네 좋아요 언제 모일까요?', lastMessageAt: minutesAgo(60 * 26), unread: false },
];

// H1. 받은 / 보낸 쪽지 목록 (최신순)
// TODO(H1): Supabase conversations + messages 조회. received/sent 는 sender_id 로 구분 (DB_SCHEMA.md)
export async function getConversations(box: MessageBox): Promise<Conversation[]> {
  await delay();
  return box === 'received' ? RECEIVED : SENT;
}

// H3. 대화 상대 정보 (채팅방 상단바)
export async function getConversation(conversationId: string): Promise<Conversation | null> {
  await delay(100);
  return RECEIVED.find((c) => c.id === conversationId) ?? null;
}

// H3. 채팅 메시지 (오래된 순)
// TODO(H2): 채팅방에 들어오면 read_at 업데이트 (읽음 처리)
export async function getMessages(conversationId: string): Promise<Message[]> {
  await delay();
  const lines: [string, boolean][] = [
    ['야 급식 진짜 맛있었어?', false],
    ['완전! 돈까스 최고였어 ㅋㅋ', true],
    ['나도 갔어야 했는데 ㅠㅠ', false],
    ['다음엔 같이 가자!', true],
    ['콜 좋아 담주에 또 나온대', false],
  ];
  // 디자인(.pen)처럼 오늘 오후 3:12 ~ 3:16 으로 표시되게 맞춰둔 목업 시각
  return lines.map(([content, mine], i) => {
    const at = new Date();
    at.setHours(15, 12 + i, 0, 0);
    return { id: `m${i}`, conversationId, content, mine, createdAt: at.toISOString() };
  });
}

// H4. 메시지 보내기
// TODO(H4): Supabase messages insert. 실패하면 throw → 화면에서 재전송 버튼 (H5)
export async function sendMessage(conversationId: string, content: string): Promise<Message> {
  await delay(200);
  return { id: `m${Date.now()}`, conversationId, content, mine: true, createdAt: new Date().toISOString() };
}

// H4. 실시간 수신 — 새 메시지가 오면 onMessage 호출. 반환값은 구독 해제 함수
// TODO(H4): supabase.channel(...).on('postgres_changes', { event: 'INSERT', table: 'messages', filter: ... }) 로 구현
export function subscribeMessages(_conversationId: string, _onMessage: (m: Message) => void): () => void {
  return () => {};
}
