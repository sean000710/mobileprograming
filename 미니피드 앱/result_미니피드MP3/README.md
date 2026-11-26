# 잼타 (Jamta)

익명으로 글을 쓰고 함께 보는 미니 피드 앱입니다. 로그인 화면 없이 Supabase 익명 인증으로 바로 시작하고, 글·좋아요·댓글·신고가 서버에 저장되어 기기 여러 대에서 같은 내용을 볼 수 있어요.

## 기능 목록

### MP1 — 화면 만들기
- 피드: 게시글 카드 목록, 글쓰기 버튼(FAB)
- 글쓰기: 최대 1000자, 빈 글 차단, 게시 후 피드 맨 위에 표시
- 상세: 닉네임·작성 시각·본문 전체 보기

### MP2 — 서버 연결
- Supabase `posts` 테이블에 글 저장·조회, 당겨서 새로고침으로 다른 기기의 글 불러오기
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

- **중복 방지**: 같은 글의 하트는 서버 응답을 받을 때까지 비활성화됩니다. `post_likes`의 복합 기본키 `(post_id, user_id)`는 사용자 한 명당 게시글 한 건에 좋아요 한 건만 허용합니다.
- **집계**: 피드 조회 시 `post_likes(user_id)`와 `comments(count)`를 함께 가져와 `likeCount`·`commentCount`·`likedByMe`를 계산합니다.
- **인덱스**: `post_likes_post_id_idx`, `comments_post_id_created_at_idx`(post_id, created_at asc), `post_reports_created_at_idx`.
- **RLS**: 세 테이블 모두 활성. 좋아요는 select/insert/delete, 댓글은 select/insert, 신고는 insert만 허용(앱에서 신고 내역 조회 불가). 모든 정책은 `to authenticated` + `is_anonymous = true` 조건입니다.

## 실행 절차

- 프레임워크: Expo SDK 58 (`expo` 58.0.23) · React Native 0.88.1 · TypeScript 6.0.3
- 백엔드: Supabase (`@supabase/supabase-js` 2.119.0)
- 실행 기기: Android 에뮬레이터 `Pixel_9` (Android API 37) 2대, Expo Go 58.0.6

1. Supabase 대시보드의 **SQL Editor**에서 이 README 옆의 `supabase/schema.sql` 전체를 실행합니다. **Authentication → Sign In / Providers → Anonymous sign-ins**를 켭니다.
2. MP3 폴더에서 다음 명령으로 설정 파일을 복사합니다.

   ```bash
   cp .env.example app/.env
   ```

   `app/.env`의 `EXPO_PUBLIC_SUPABASE_URL`에 프로젝트 URL을, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`에 해당 프로젝트의 Publishable Key를 입력합니다. 제출 ZIP에는 키 이름만 적힌 최상위 `.env.example`을 넣고, 로컬 `app/.env`는 제외합니다.
3. MP3 폴더에서 앱 의존성을 설치하고 Expo 개발 서버를 실행합니다.

   ```bash
   cd app
   npm ci
   npx expo start
   ```

4. Android 에뮬레이터 두 대에서 Expo Go로 같은 개발 서버를 엽니다. 촬영 환경에서는 별도 터미널 두 개에서 각각 `emulator -avd Pixel_9 -read-only -port 5554`(기기 A)와 `emulator -avd Pixel_9 -read-only -port 5556`(기기 B)를 실행했습니다. 두 기기는 서로 다른 익명 세션을 사용합니다.

## 확인 방법

시험에는 기기별 익명 사용자 2명과 시험 글 1건을 사용합니다. 캡처에서 사용한 게시글은 `hello supabase test`, 댓글은 `20261126`입니다. 동기화와 신고는 두 기기 모두 온라인에서 확인하고, 오프라인 작성 실패 안내는 비행기 모드에서 확인합니다.

### 좋아요 토글·중복 방지·기기 간 동기화
- 조작: 두 기기에서 좋아요가 0인 시험 글을 엽니다. A에서 하트를 누르고 B에서 피드를 당겨 새로고침합니다. A에서 취소하고 B에서 새로고침한 후, A에서 다시 좋아요를 누르고 B에서 새로고침합니다.
- 기대 결과: 두 기기에서 같은 글의 집계가 차례로 1, 0, 1이 됩니다. 마지막에는 A의 하트만 채워지고, 서버에는 이 글·사용자 조합의 좋아요 한 건만 남습니다.
- 스크린샷: 01_like_device_a.png, 02_like_device_b.png, 03_like_sync_a_b.png

### 댓글 작성·목록
- 조작: 기기 A에서 글 상세로 들어가 하단 입력창에 `20261126`을 쓰고 전송 버튼을 누릅니다. 기기 B에서 같은 글 상세를 엽니다.
- 기대 결과: 기기 A의 댓글 목록 맨 아래에 방금 쓴 댓글이 `익명 XXXX` 닉네임으로 추가되고 댓글 수가 1 증가합니다. 기기 B에서도 같은 댓글이 보입니다. 댓글이 없으면 "첫 댓글을 남겨보세요"가 표시됩니다.
- 스크린샷: 04_comment_device_a.png, 05_comment_device_b.png, 06_comment_sync_a_b.png

### 신고 사유 서버 기록
- 조작: 상세 화면의 깃발을 눌러 "신고하기" 버튼 상태를 확인합니다. 사유로 "기타"를 선택하고 추가 설명을 비운 채 신고합니다. Supabase Table Editor의 `post_reports`에서 해당 게시글의 신고 행을 확인합니다.
- 기대 결과: 사유를 고르면 제출 버튼이 활성화되고, 제출하면 "신고가 접수되었습니다"라는 안내가 뜹니다. 서버 행에는 `reason = other`, `detail = NULL`, 해당 글의 `post_id`와 익명 신고자의 `reporter_id`가 기록됩니다.
- 스크린샷: 07_report_reason.png, 08_report_done.png, 09_report_server.png

### 커뮤니티 가이드라인과 공개 범위
- 조작: 제출 폴더의 `GUIDELINES.md`에서 금지 콘텐츠, 신고 처리 원칙, 데이터별 공개 범위와 이유를 읽습니다. 신고 접수 화면 및 `supabase/schema.sql`의 신고 정책과 대조합니다.
- 기대 결과: 운영자가 판단할 기준과 신고자 보호 절차가 있고, 좋아요·댓글·신고 정보가 누구에게 보이는지 설명합니다. 앱에서는 신고자에게 접수 결과가 표시되고, 저장된 신고 내역은 권한이 있는 운영자가 확인합니다. 문서의 예시는 실제 개인의 정보를 포함하지 않습니다.

### 입력 데이터와 스크린샷의 개인정보 점검
- 조작: 시험 게시글·댓글·신고 내용과 제출할 `screenshots/`의 각 이미지를 확인합니다. 앱 화면의 닉네임, 자유 입력란, 서버 콘솔에 보이는 행과 열까지 살펴봅니다.
- 기대 결과: 시험 문구와 익명 식별자만 사용하며 실명·연락처·실제 인물 사진이 없습니다.

### 실행 절차와 확인 방법
- 조작: 압축을 푼 MP3 폴더에서 위 실행 절차에 따라 설정한 뒤 두 기기에서 같은 시험 글을 열고 각 항목의 조작을 수행합니다.
- 기대 결과: 적힌 명령·버전·기기로 앱을 실행할 수 있고, 각 기능의 기대 결과를 `screenshots/`의 해당 파일과 대조할 수 있습니다.
