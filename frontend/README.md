# 잼타(JamSNS) 프론트엔드

React Native(Expo SDK 58) + Expo Router + TypeScript + Supabase

> 처음이라면 **1. 실행하기 → 3. 규칙 → 5. 기능 만드는 순서**만 읽어도 작업할 수 있어요.

---

## 1. 실행하기

### 처음 한 번만
1. [Node.js LTS](https://nodejs.org) 설치 (설치 확인: 터미널에서 `node -v`)
2. 폰에 **Expo Go** 앱 설치 (Play 스토어 / App Store)
3. 이 폴더에서 패키지 설치
   ```bash
   cd frontend
   npm install
   ```
4. (Supabase 연결 시) `.env.example` 을 복사해서 `.env` 로 만들고 값 채우기 — 값은 PM 에게 받으세요.
   `.env` 가 없어도 앱은 **목업(가짜 데이터) 모드**로 돌아갑니다.

### 매번
```bash
npx expo start
```
- 터미널에 뜬 **QR 코드**를 폰 카메라(iOS) 또는 Expo Go 앱(안드로이드)으로 찍으면 실행돼요.
- PC 와 폰이 **같은 와이파이**에 있어야 합니다. 안 되면 `npx expo start --tunnel`
- 안드로이드 에뮬레이터가 있으면 터미널에서 `a` 키
- 코드를 저장하면 앱이 자동으로 새로고침돼요.

### 목업 모드로 둘러보기
Supabase 설정이 없을 때 로그인 화면에 **"개발용으로 둘러보기"** 버튼이 보여요. 누르면 로그인 없이 모든 화면을 볼 수 있습니다.
- 글쓰기에서 제목이나 내용에 `욕설` 을 넣고 게시하면 "부적절한 내용" 모달을 확인할 수 있어요.

### 작업 끝나고 PR 올리기 전에 꼭
```bash
npm run typecheck   # 타입 오류 검사
npm run lint        # 코드 스타일 검사
```
둘 다 아무 오류 없이 끝나야 PR 을 올릴 수 있어요.

---

## 2. 폴더 구조

```
frontend/src/
├─ app/                ← 화면 "주소"만 정하는 곳 (Expo Router). 거의 건드릴 일 없음
│  ├─ _layout.tsx      ← 앱 전체 틀, 로그인 여부에 따른 화면 이동 규칙
│  ├─ (auth)/          ← 로그인 / 회원가입
│  ├─ (tabs)/          ← 하단 탭 4개 (홈, 캘린더, 메시지, 프로필)
│  ├─ board-select.tsx
│  ├─ post/[id].tsx    ← 게시물 상세 (/post/p1 처럼 id 가 바뀜)
│  ├─ post/write.tsx   ← 글쓰기
│  └─ chat/[id].tsx    ← 채팅방
│
├─ features/           ← ★ 여러분이 작업하는 곳. 기능마다 폴더 하나
│  ├─ auth/            로그인, 회원가입, 학교 찾기
│  ├─ board/           게시판 선택
│  ├─ feed/            홈 피드, 게시물 카드
│  ├─ post/            게시물 상세, 댓글
│  ├─ write/           글쓰기
│  ├─ report/          신고 모달
│  ├─ messages/        쪽지, 채팅
│  ├─ profile/         마이페이지
│  └─ calendar/        캘린더 (나중에)
│     각 폴더 안:
│       api.ts         서버 호출 함수 (지금은 목업 데이터)
│       screens/       화면
│       components/    그 기능에서만 쓰는 부품
│
├─ shared/             ← 모두가 같이 쓰는 것 (PM 담당)
│  ├─ ui/              AppText, Button, TextField, AppModal, TopBar, GradientHeader,
│  │                   IconBadge, MessageInput, PostMeta, Icon(lucide) …
│  ├─ lib/             supabase 연결, 시간 표시, useAsync
│  └─ theme.ts         색상 / 폰트 / 간격 (디자인 .pen 과 동일)
│
└─ types/models.ts     ← 데이터 모양 정의 (DB 담당)
```

---

## 3. 규칙 (충돌 없이 같이 작업하려면)

| 폴더 | 누가 수정 | 다른 사람이 바꾸고 싶으면 |
|---|---|---|
| `features/<내 기능>/` | 그 기능 담당자 | 담당자에게 말하기 |
| `shared/`, `app/` | PM | PM 에게 요청 (이슈 or 카톡) |
| `types/models.ts` | DB 담당 | DB 담당에게 요청 |

- **글자는 `Text` 대신 `AppText`**, 색은 `#2563EB` 처럼 직접 쓰지 말고 **`colors.primary`** 처럼 `theme.ts` 에서 가져오기
- **디자인 수치는 `JamSNS.pen` 에 적힌 값 그대로** 쓰면 돼요. 예) `.pen` 에서 `fontSize 13 / fontWeight 700` → `<AppText size={13} weight="700">`, 제목용 Jua 폰트 → `<AppText jua size={18}>`
- **아이콘은 lucide** (`.pen` 에 적힌 이름 그대로): `<Icon name="school" size={18} color={colors.primary} />`. 목록에 없는 아이콘은 PM 에게 요청
- **화면에서 Supabase 를 직접 부르지 않기.** 반드시 그 기능의 `api.ts` 함수를 거치기
- **api.ts 함수의 이름과 반환 모양은 바꾸지 않기.** 화면과 서버 담당이 이 모양을 약속으로 쓰고 있어요. 바꿔야 하면 PM 과 상의
- 서버 검증이 필요한 기능(학부모 차단, 작성 제한, 필터, 익명)은 **화면에서 막는 건 안내용**이에요. 진짜 차단은 서버(RLS / Python)에서 합니다.

---

## 4. 기능 번호 → 파일 위치

기능 번호는 `docs/JamSNS_기능_목록.txt` 와 같아요. 코드에서 `TODO(번호)` 로 검색하면 할 일 위치가 나옵니다.
(VS Code: `Ctrl+Shift+F` → `TODO(C5)`)

| 번호 | 기능 | 파일 |
|---|---|---|
| A1~A3 | 로그인, 회원가입, 학교 찾기 | `features/auth/` |
| B1~B2 | 게시판 선택, 학부모 차단 | `features/board/` |
| C1~C5 | 홈 피드 (상단바, 공지, 인기, 카드, 목록) | `features/feed/` |
| C6 | 하단 탭 | `app/(tabs)/_layout.tsx` (PM) |
| D1~D5 | 게시물 상세, 좋아요, 댓글 | `features/post/` |
| E1~E3 | 글쓰기, 글자 수, 사진 첨부 | `features/write/` |
| F1~F2 | 작성 제한, 부적절 내용 모달 | `features/write/` (화면) + 서버 |
| G1~G3 | 신고 | `features/report/` |
| H1~H5 | 쪽지, 채팅 | `features/messages/` |
| I1~I4 | 마이페이지 | `features/profile/` |
| J1~J4 | 공통 | `shared/` (PM) |

---

## 5. 기능 만드는 순서 (예: C5 피드 목록)

**샘플로 로그인(A1)이 끝까지 연결돼 있어요.** `features/auth/api.ts` 의 `signInWithPhone` 과 `screens/LoginScreen.tsx` 를 먼저 읽어보세요.

1. `develop` 브랜치에서 내 브랜치 만들기: `git switch develop && git pull && git switch -c feature/C5-feed-list`
2. `TODO(C5)` 검색해서 할 일 확인
3. **화면 먼저** — 목업 데이터로 화면이 디자인대로 보이고 동작하게 만들기
4. **서버 연결** — `api.ts` 함수 안쪽만 Supabase 호출로 바꾸기 (함수 이름/반환 모양 유지)
   ```ts
   const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
   if (error) throw error;
   return data.map(...);   // DB 컬럼(snake_case) → 앱 모양(camelCase) 으로 변환
   ```
5. `npm run typecheck && npm run lint` 통과 확인
6. 커밋 → push → GitHub 에서 `develop` 으로 PR → PM 리뷰 후 머지
   (자세한 git 사용법: 저장소 루트의 `github 매뉴얼.md`)

### 데이터 불러오기 패턴
```tsx
const { data, loading, error, reload, setData } = useAsync(() => getPosts(boardType), [boardType]);
```
- `loading` 이면 `<LoadingState />`, `error` 면 `<ErrorState onRetry={reload} />`, 비어 있으면 `<EmptyState />`
- 좋아요처럼 화면 값을 바로 바꿀 때는 `setData(prev => ...)`

### 화면 이동
```tsx
import { router } from 'expo-router';
router.push('/post/write');                                         // 이동
router.push({ pathname: '/post/[id]', params: { id: post.id } });  // id 넘기기
router.back();                                                      // 뒤로
```

---

## 6. 아직 팀에서 정해야 하는 것
- 로그인 방식: 지금은 전화번호를 `01012345678@jamta.app` 형태 이메일로 바꿔 Supabase 이메일 로그인을 씁니다 (SMS 비용 때문). Supabase 에서 **Confirm email 끄기** 필요
- 작성 제한 수치, 비밀번호/닉네임 규칙, 사진 용량 제한
- 익명 글을 상세 화면에서도 익명으로 보일지, 익명 토글을 지난 글에도 적용할지
- 그 밖에는 `docs/JamSNS_기능_목록.txt` 의 "아직 정해지지 않은 것" 참고

## 7. 자주 막히는 것
| 증상 | 해결 |
|---|---|
| QR 찍어도 연결 안 됨 | 같은 와이파이인지 확인, 안 되면 `npx expo start --tunnel` |
| 이상한 캐시 오류 | `npx expo start -c` (캐시 지우고 시작) |
| 패키지 추가하고 싶음 | `npm install` 대신 **`npx expo install 패키지명`** — 그리고 PM 에게 먼저 말하기 |
| `.env` 바꿨는데 반영 안 됨 | 서버 껐다가 `npx expo start -c` |
