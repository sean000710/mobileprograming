# 모두의 피드 — 2단계 서버 동기화

MP1에서 만든 React Native 피드 앱에 Supabase 서버 저장과 익명 인증을 추가한 프로젝트입니다. 기기 A에서 작성한 글은 Supabase에 저장되고, 기기 B에서 당겨서 새로고침하면 같은 글을 확인할 수 있습니다.

## 선택한 BaaS와 이유

**Supabase**를 선택했습니다.

- PostgreSQL 테이블에서 게시글 데이터를 직접 확인할 수 있습니다.
- Auth의 익명 로그인을 사용해 이메일·전화번호를 수집하지 않고 기기별 사용자를 구분할 수 있습니다.
- Row Level Security(RLS)로 익명 인증을 완료한 사용자만 게시글을 읽고 작성하도록 제한할 수 있습니다.
- React Native에서 `@supabase/supabase-js` 하나로 인증과 데이터베이스를 함께 사용할 수 있습니다.

이 과제에서는 Firebase, FastAPI, AI 검열, 댓글, 좋아요, 이미지, 실시간 구독을 사용하지 않습니다.

## 익명 인증 방식

앱이 실행되면 `supabase.auth.getSession()`으로 저장된 세션을 확인합니다. 세션이 없으면 `supabase.auth.signInAnonymously()`를 호출합니다.

- 이메일·전화번호·닉네임 입력을 받지 않습니다.
- Supabase가 발급한 익명 사용자 UUID를 `posts.author_id`에 저장합니다.
- 화면에는 UUID 앞 4자리만 사용한 `익명 1A2B` 형태로 표시합니다.
- 세션은 AsyncStorage에 저장해 앱을 다시 실행해도 같은 익명 사용자를 유지합니다.

## 구현 기능

| 평가 요구 | 구현 내용 |
|---|---|
| 두 기기 동기화 | `posts` 테이블을 공통 피드로 조회 |
| 익명 인증만 사용 | 앱 시작 시 `signInAnonymously()` 실행 |
| 개인정보 수집 금지 | 이메일·전화번호 입력 및 관련 코드 없음 |
| 당겨서 새로고침 | React Native `RefreshControl` 사용 |
| 설정 키 분리 | `.env`에서 URL과 Publishable Key 로드 |
| 작성 실패 안내 | 저장 실패 시 글쓰기 화면에 오류 문구 표시 |
| 중복 제출 방지 | 저장 중 게시 버튼 비활성화 및 로딩 표시 |

## Supabase 설정 절차

### 1. 프로젝트 생성

Supabase Dashboard에서 새 프로젝트를 생성합니다.

### 2. 익명 로그인 활성화

Supabase Dashboard에서 **Authentication → Providers → Anonymous Sign-Ins**를 활성화합니다.

### 3. 테이블과 RLS 생성

Supabase의 **SQL Editor**에서 `supabase/schema.sql`의 전체 내용을 실행합니다. 다음 항목이 생성됩니다.

- `public.posts` 테이블
- 작성 시간 정렬용 인덱스
- 익명 인증 사용자 조회 정책
- 본인 UUID로만 작성할 수 있는 INSERT 정책

### 4. 환경변수 입력

프로젝트 루트의 `.env.example`을 `app/.env`로 복사하고 값을 입력합니다.

```env
EXPO_PUBLIC_SUPABASE_URL=https://프로젝트주소.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=클라이언트용_Publishable_Key
```

`service_role` Secret Key는 앱에 입력하거나 제출하면 안 됩니다. 실제 값이 들어간 `app/.env`도 ZIP에 포함하지 않습니다.

## 실행 절차

Node.js LTS, Android Studio 에뮬레이터 또는 Expo Go가 필요합니다.

```bash
cd app
npm install
npx expo start
```

개발 중 코드 검사:

```bash
npm run typecheck
npm run lint
```

환경변수를 변경했다면 실행 중인 Expo를 종료한 뒤 다시 시작합니다. 캐시 문제가 있으면 다음 명령을 사용합니다.

```bash
npx expo start -c
```

## 기기 2대 동기화 확인

1. Android 에뮬레이터 A와 B를 실행합니다.
2. 두 기기에서 같은 Expo 개발 서버의 앱을 엽니다.
3. 기기 A에서 연필 버튼을 누르고 식별하기 쉬운 글을 작성합니다.
4. 기기 A 화면을 `screenshots/01_device_a_write.png`로 저장합니다.
5. 기기 B의 피드를 아래로 당겨 새로고침합니다.
6. 같은 글이 보이는 기기 B 화면을 `screenshots/02_device_b_sync.png`로 저장합니다.
7. Supabase Table Editor의 `posts` 행을 `screenshots/03_supabase_posts.png`로 저장합니다.

서로 다른 익명 사용자인지는 Supabase의 **Authentication → Users**에서 익명 사용자 UUID가 2개 생성되었는지 확인할 수 있습니다.

## 오류 처리 확인

작성 실패 안내를 확인하려면 앱 실행 후 네트워크를 끄고 글을 작성합니다. 저장에 실패하면 다음 안내가 표시됩니다.

> 게시글을 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요.

Supabase 설정값이 없으면 피드에 설정 확인 안내와 `다시 시도` 버튼이 표시됩니다.

## 데이터 구조

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | uuid | 게시글 기본키 |
| `author_id` | uuid | Supabase 익명 사용자 ID |
| `content` | text | 게시글 내용, 공백 제외 1~1000자 |
| `created_at` | timestamptz | 서버 작성 시각 |

최신 글이 먼저 보이도록 `created_at desc`로 조회합니다.

## 주요 코드 위치

```text
app/
├─ src/shared/lib/supabase.ts                 Supabase 클라이언트·세션 저장
├─ src/features/posts/PostsProvider.tsx       익명 인증·게시글 조회·작성
├─ src/features/posts/screens/FeedScreen.tsx  피드·당겨서 새로고침·조회 오류
└─ src/features/posts/screens/WritePostScreen.tsx 작성·중복 방지·실패 안내
supabase/
└─ schema.sql                                 posts 테이블·인덱스·RLS
screenshots/
└─ README.md                                  필수 캡처 파일 안내
```

## 제출 전 확인

- [ ] 실제 `app/.env` 제외
- [ ] `node_modules`, `.expo`, `dist`, `build` 제외
- [ ] 기기 A 작성 화면 포함
- [ ] 기기 B 동기화 화면 포함
- [ ] Supabase 콘솔 데이터 화면 포함
- [ ] 익명 인증 외 로그인 코드 없음
- [ ] ZIP 최상위에 `app/`, `README.md`, `.env.example`, `screenshots/`, `prompts_log.md`가 바로 표시됨

