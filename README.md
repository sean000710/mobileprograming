# 잼타 (Jamta)

익명으로 글을 쓰고 함께 보는 미니 피드 앱입니다. 로그인 화면 없이 Supabase 익명 인증으로 바로 시작하고, 글·좋아요·댓글·신고가 서버에 저장되어 기기 여러 대에서 같은 내용을 볼 수 있어요.

- 프레임워크: Expo SDK 58 (`expo` 58.0.23) · React Native 0.88.1 · TypeScript 6.0.3
- 백엔드: Supabase (`@supabase/supabase-js` 2.119.0)
- 실행 기기: MP2는 `Medium_Phone_API_36.1`, MP3는 `Pixel_9` (API 37) Android 에뮬레이터 2대

## 기능 목록

### MP1 — 화면 만들기
- 피드: 더미 게시글 10개의 스크롤 목록, 글쓰기 버튼(FAB)
- 글쓰기: 최대 1000자, 빈 글 차단, 게시 후 피드 맨 위에 표시
- 상세: 닉네임·작성 시각·본문 전체 보기

### MP2 — 서버 연결
- Supabase `posts` 테이블에 글 저장·조회 (서버 동기화), 당겨서 새로고침
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

## 실행 절차와 확인 방법

각 단계 폴더의 `app/`에서 앱을 실행합니다. MP2와 MP3는 각각 단계 폴더 최상위의 `.env.example`을 같은 단계의 `app/.env`로 복사한 뒤 Supabase 설정값을 입력합니다.

| 단계 | 실행 절차와 제출 기준별 확인 방법 |
| --- | --- |
| MP1 | [더미 피드·글쓰기·상세 보기](<미니피드 앱/result_미니피드MP1/README.md>) |
| MP2 | [익명 인증·서버 저장·두 기기 동기화](<미니피드 앱/result_미니피드MP2/README.md>) |
| MP3 | [좋아요·댓글·신고](<미니피드 앱/result_미니피드MP3/README.md>) · [커뮤니티 가이드라인](<미니피드 앱/result_미니피드MP3/GUIDELINES.md>) |
