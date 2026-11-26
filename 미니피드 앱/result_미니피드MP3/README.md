# 잼타 (Jamta)

익명으로 글을 쓰고 함께 보는 미니 피드 앱입니다. 로그인 화면 없이 Supabase 익명 인증으로 바로 시작하고, 글·좋아요·댓글·신고가 서버에 저장되어 기기 여러 대에서 같은 내용을 볼 수 있어요.

- 프레임워크: Expo SDK 58 (`expo` 58.0.23) · React Native 0.88.1 · TypeScript 6.0.3
- 백엔드: Supabase (`@supabase/supabase-js` 2.119.0)
- 실행 기기: Android 에뮬레이터 `Medium_Phone_API_36.1` 2대

## 기능 목록

### MP1 — 화면 만들기
- 피드: 게시글 카드 목록, 당겨서 새로고침, 글쓰기 버튼(FAB)
- 글쓰기: 최대 1000자, 빈 글 차단, 게시 후 피드 맨 위에 표시
- 상세: 닉네임·작성 시각·본문 전체 보기

### MP2 — 서버 연결
- Supabase `posts` 테이블에 글 저장·조회 (서버 동기화)
- 익명 인증(`signInAnonymously`)으로 사용자 구분, 닉네임은 `익명 ` + 사용자 ID 앞 4자리 대문자
- 오프라인·서버 오류 시 실패 안내 문구와 "다시 시도" 제공

### MP3 — 상호작용 (좋아요 · 댓글 · 신고)
- 좋아요: 카드·상세에서 하트 토글, 낙관적 업데이트, 중복 좋아요 방지, 기기 간 집계 동기화
- 댓글: 상세 화면에서 목록 조회(오래된 순)와 작성(최대 500자), 댓글 수 표시
- 신고: 상세 화면 상단 깃발 버튼 → 사유 5가지 + 추가 설명(선택, 300자) → 서버 기록

## 상호작용 데이터 구조

| 테이블 | 컬럼 | 관계 |
| --- | --- | --- |
| `public.post_likes` | `post_id` uuid, `user_id` uuid, `created_at` timestamptz | `post_id → posts(id)` cascade, `user_id → auth.users(id)` cascade |
| `public.comments` | `id` uuid pk, `post_id` uuid, `author_id` uuid, `content` text(1~500자), `created_at` timestamptz | `post_id → posts(id)` cascade, `author_id → auth.users(id)` cascade |
| `public.post_reports` | `id` uuid pk, `post_id` uuid, `reporter_id` uuid, `reason` text(`spam`/`abuse`/`sexual`/`illegal`/`other`), `detail` text(≤300자), `created_at` timestamptz | `post_id → posts(id)` cascade, `reporter_id → auth.users(id)` cascade |

- **중복 방지**: `post_likes`는 `primary key (post_id, user_id)` 복합 기본키라서 한 사용자가 같은 글에 두 번 좋아요를 넣을 수 없어요. 앱은 insert가 `23505`(중복)로 실패하면 이미 좋아요를 누른 상태로 보고 성공 처리합니다.
- **집계**: 피드 조회 시 `post_likes(user_id)`와 `comments(count)`를 함께 가져와 `likeCount`·`commentCount`·`likedByMe`를 계산합니다.
- **인덱스**: `post_likes_post_id_idx`, `comments_post_id_created_at_idx`(post_id, created_at asc), `post_reports_created_at_idx`.
- **RLS**: 세 테이블 모두 활성. 좋아요는 select/insert/delete, 댓글은 select/insert, 신고는 insert만 허용(앱에서 신고 내역 조회 불가). 모든 정책은 `to authenticated` + `is_anonymous = true` 조건입니다.

## 실행 절차

1. 의존성 설치

```bash
cd app
npm install
```

2. 환경 변수 설정 — `app/.env.example`을 복사해 `app/.env`를 만들고 값을 채웁니다.

```bash
cp .env.example .env
```

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

3. Supabase SQL 실행 — 대시보드 SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다. (`posts`, `post_likes`, `comments`, `post_reports` 테이블과 정책·인덱스가 생성됩니다.)

4. Anonymous sign-ins 활성화 — Supabase 대시보드 **Authentication → Sign In / Providers → Anonymous sign-ins** 를 켭니다.

5. 앱 실행

```bash
npx expo start
```

Android 에뮬레이터 `Medium_Phone_API_36.1` 2대를 띄우고 각각 `a` 키로 앱을 엽니다.

## 확인 방법

### 좋아요 토글·중복 방지·기기 간 동기화
- 조작: 기기 A에서 글 카드의 하트를 누르고, 같은 하트를 한 번 더 눌러 취소한 뒤 다시 누릅니다. 기기 B에서 피드를 당겨서 새로고침합니다.
- 기대 결과: 기기 A의 하트가 빨갛게 채워지고 숫자가 1 증가, 다시 누르면 원래대로 돌아갑니다. 여러 번 눌러도 서버에는 한 건만 남아 숫자가 1을 넘지 않습니다. 기기 B의 같은 글에도 좋아요 1이 표시됩니다.
- 스크린샷: `01_like_device_a.png`, `02_like_device_b.png`

### 댓글 작성·목록
- 조작: 기기 A에서 글 상세로 들어가 하단 입력창에 댓글을 쓰고 전송 버튼을 누릅니다. 기기 B에서 같은 글 상세를 엽니다.
- 기대 결과: 기기 A의 댓글 목록 맨 아래에 방금 쓴 댓글이 `익명 XXXX` 닉네임으로 추가되고 댓글 수가 1 증가합니다. 기기 B에서도 같은 댓글이 보입니다. 댓글이 없으면 "첫 댓글을 남겨보세요"가 표시됩니다.
- 스크린샷: `03_comment_device_a.png`, `04_comment_device_b.png`

### 신고 사유 서버 기록
- 조작: 상세 화면 오른쪽 위 깃발 버튼을 눌러 신고 모달을 열고, 사유를 고르지 않은 상태와 고른 상태를 비교한 뒤 "기타"를 선택하고 설명을 적어 신고합니다. 이후 Supabase Table Editor에서 `post_reports`를 확인합니다.
- 기대 결과: 사유를 고르기 전에는 "신고하기" 버튼이 비활성입니다. 신고하면 모달이 닫히고 "신고가 접수되었습니다" 안내가 뜹니다. 서버 `post_reports`에 `reason = other`, `detail`, `reporter_id`가 기록됩니다.
- 스크린샷: `05_report_reason.png`, `06_report_done.png`, `07_report_server.png`

- 시험 데이터: 익명 사용자 2명(기기 A·B), 게시글 1건 이상, 좋아요 1건, 댓글 1건, 신고 1건
- 네트워크: 정상 연결 상태에서 확인하고, 실패 안내는 비행기 모드로 전환해 확인합니다.
