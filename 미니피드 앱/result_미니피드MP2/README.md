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

프로젝트 루트의 `.env.example`을 `app/.env`로 복사한 뒤 값을 입력합니다.

```bash
cp .env.example app/.env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://프로젝트주소.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=클라이언트용_Publishable_Key
```

`service_role` Secret Key는 앱에 입력하거나 제출하면 안 됩니다. 실제 값이 들어간 `app/.env`도 ZIP에 포함하지 않습니다.

## 실행 절차

- 프레임워크/SDK: Expo SDK 58 (`expo 58.0.23`) / React Native 0.88.1 / TypeScript
- 백엔드: Supabase (`@supabase/supabase-js`)
- 실행 기기: Android 에뮬레이터 `Medium_Phone_API_36.1` (API 36.1) 2대(같은 AVD를 `-read-only`로 포트 5554·5556에 실행), Expo Go
- 사전 준비: Node.js LTS, Android Studio 에뮬레이터 또는 Expo Go, 위 "Supabase 설정 절차"의 `app/.env`

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

## 확인 방법

### 두 기기 동기화

- 조작: Android 에뮬레이터 A(5554)와 B(5556)에서 같은 Expo 개발 서버의 앱을 연다. 기기 A에서 연필 버튼을 눌러 글을 작성하고 게시한 뒤, 기기 B의 피드를 아래로 당겨 새로고침한다
- 기대 결과: 기기 A에서 작성한 글이 기기 B 새로고침 후 피드 맨 위에 표시된다
- 스크린샷: 01_device_a_write.png, 02_device_b_sync.png

### 익명 인증만 사용

- 조작: 앱을 처음 실행한다 (이메일·전화번호·닉네임 입력 화면 없음). 작성자는 익명 사용자 UUID 앞 4자리로 표시된다
- 기대 결과: 로그인 입력 없이 피드가 열리고, 글 작성자가 `익명 XXXX` 형태로 표시된다
- 스크린샷: 01_device_a_write.png, 02_device_b_sync.png

### 작성 실패 안내

- 조작: 에뮬레이터의 Wi-Fi와 모바일 데이터를 끄고(비행기 모드와 동일) 글쓰기 화면에서 내용을 입력해 게시를 누른다
- 기대 결과: 앱이 종료되지 않고 글쓰기 화면에 "게시글을 저장하지 못했어요. 네트워크 연결을 확인한 뒤 다시 시도해 주세요." 안내가 빨간 글씨로 표시된다
- 스크린샷: 03_write_fail_offline.png

### 설정 키 분리

- 조작: `app/src/shared/lib/supabase.ts`와 `.env.example`을 확인한다
- 기대 결과: URL과 Publishable Key는 `process.env.EXPO_PUBLIC_*`로만 읽고, 소스에 키가 하드코딩되어 있지 않으며 `.env.example`에는 빈 값만 있다
- 스크린샷: (해당 없음 - 코드 확인)

시험 데이터: Supabase `posts` 테이블 (`supabase/schema.sql`로 생성). 시험 글은 `from_emulator_A_5554`, `offline test` 등 개인정보 없는 문구만 사용

네트워크: 필요 (온라인에서 동기화 확인 / 작성 실패 안내만 Wi-Fi·데이터를 끈 오프라인 상태)

Supabase 설정값이 없으면 피드에 설정 확인 안내와 `다시 시도` 버튼이 표시됩니다.

서로 다른 익명 사용자인지는 Supabase의 **Authentication → Users**에서 익명 사용자 UUID가 2개 생성되었는지 확인할 수 있습니다.

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
screenshots/                                    확인 방법에 쓰인 스크린샷(01_~03_)
.env.example                                    설정 키 이름만 있는 예시 파일
```

## 제출 전 확인

- [ ] 실제 `app/.env`와 `.git` 폴더 제외
- [ ] `node_modules`, `.expo`, `dist`, `build` 제외
- [x] 기기 A 작성 화면 포함 (`01_device_a_write.png`)
- [x] 기기 B 동기화 화면 포함 (`02_device_b_sync.png`)
- [x] 작성 실패 안내 화면 포함 (`03_write_fail_offline.png`)
- [ ] (선택) Supabase 콘솔 데이터 화면 추가 시 `04_supabase_posts.png`로 저장하고 위 확인 방법에 적기
- [ ] 익명 인증 외 로그인 코드 없음
- [ ] `package-lock.json` 포함, `android/`·`ios/` 폴더는 없어도 됨
- [ ] 스크린샷에 실명·연락처 등 개인정보 없음
- [ ] ZIP 최상위에 `app/`, `README.md`, `.env.example`, `screenshots/`가 바로 표시됨 (`prompts_log.md`는 선택)

