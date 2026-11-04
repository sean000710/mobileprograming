// 캘린더 탭 — 나중에 만들 것 (디자인 화면 없음, DB_SCHEMA.md 의 school_events 참고)
import { EmptyState, Screen, TopBar } from '@/shared/ui';

export default function CalendarScreen() {
  return (
    <Screen>
      <TopBar title="캘린더" titleSize={20} />
      <EmptyState icon="calendar" message="캘린더는 준비 중이에요" />
    </Screen>
  );
}
