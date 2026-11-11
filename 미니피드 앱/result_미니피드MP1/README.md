# 잼타(JamSNS) 게시글 피드 앱

학교 커뮤니티 앱 "잼타"의 **게시글 피드** 기능을 React Native(Expo)로 구현한 과제물입니다.
서버 없이 **더미 데이터**로 동작하며, 글쓰기 → 피드 최상단 추가 → 상세 보기까지 한 흐름으로 확인할 수 있습니다.

| 항목 | 내용 |
|---|---|
| 프레임워크 | React Native 0.88 + Expo SDK 58 |
| 언어 | TypeScript |
| 화면 이동 | Expo Router (파일 기반 라우팅) |
| 아이콘 / 폰트 | lucide-react-native / Jua, Noto Sans KR |
| 데이터 | 앱 메모리의 더미 데이터 (서버·DB 없음) |

## 구현한 기능

| 요구 기능 | 구현 위치 |
|---|---|
| 게시글 카드(닉네임·작성 시각·내용)로 구성된 스크롤 피드 | `app/src/features/posts/screens/FeedScreen.tsx`, `components/PostCard.tsx` |
| 글쓰기 화면에서 작성한 글이 피드 최상단에 추가 | `screens/WritePostScreen.tsx` → `PostsProvider.tsx`의 `addPost` (목록 맨 앞에 삽입, 피드는 자동으로 맨 위로 스크롤) |
| 게시글을 탭하면 상세 화면으로 이동 | `FeedScreen.tsx`의 `router.push('/post/[id]')` → `screens/PostDetailScreen.tsx` |
| 작성 시각을 "5분 전" 같은 상대 시간으로 표시 | `app/src/shared/lib/time.ts`의 `formatRelativeTime` (+ 30초마다 갱신하는 `useNow`) |

## 화면 구성

| 화면 | 경로 | 설명 | 스크린샷 |
|---|---|---|---|
| 피드 | `/` (앱을 켜면 첫 화면) | 상단바("우리 학교 게시판 / 잼타고등학교") + 게시글 카드 목록 + 오른쪽 아래 글쓰기(연필) 버튼 | `screenshots/01_feed.png` |
| 글쓰기 | `/post/write` (모달) | 내용 입력 후 우측 상단 "게시" 버튼. 내용이 비어 있으면 버튼이 비활성화됨. X 버튼으로 닫기 | `screenshots/02_write.png` |
| 글쓰기 후 피드 | `/` | 방금 쓴 글이 "방금 전"으로 목록 맨 위에 나타남 | `screenshots/03_feed_after_post.png` |
| 상세 | `/post/[id]` | 카드를 누르면 열림. 닉네임, 상대 시간, 내용 전체 표시. 뒤로가기 버튼 | `screenshots/04_detail.png` |

- 카드의 내용은 3줄까지만 보이고 길면 `…`로 잘리며, 상세에서는 전체가 보입니다.
- 화면 디자인(색상·폰트·간격)은 팀 디자인 파일 `JamSNS.pen`의 값을 따랐습니다.
- 스크린샷은 Android 에뮬레이터(Pixel 9)의 Expo Go에서 촬영했습니다.

## 더미 데이터 구조

게시글 한 개의 모양 (`app/src/features/posts/types.ts`):

```ts
interface Post {
  id: string;         // 고유 값. 예) "seed-1", 새 글은 "post-<시각>"
  nickname: string;   // 작성자 닉네임
  content: string;    // 글 내용 (줄바꿈 가능, 최대 1000자)
  createdAt: string;  // 작성 시각 (ISO 문자열) — 화면에서는 상대 시간으로 변환해 표시
}
```

- **예시 글 4개** (`app/src/features/posts/seed.ts`): 앱을 켜면 처음 보이는 데이터입니다. 박지민(5분 전), 김도윤(32분 전), 최서연(2시간 전), 이하은(3시간 전)이 쓴 글이며, `createdAt`은 앱을 켠 시점 기준 `minutesAgo(n)`으로 만들기 때문에 항상 "5분 전"처럼 보입니다.
- **저장소** (`PostsProvider.tsx`): React Context에 `posts` 배열을 들고 있으며 아래 함수를 제공합니다.
  - `posts` : 게시글 목록 (최신 글이 맨 앞)
  - `addPost(content)` : 새 글을 만들어 배열 **맨 앞**에 추가
  - `getPost(id)` : 상세 화면에서 id로 글을 찾음
- 로그인이 없으므로 새 글의 작성자는 고정 닉네임 **`열정만점잼타`**(`MY_NICKNAME`)입니다.
- 데이터는 앱 메모리에만 있어서, **앱을 완전히 종료했다가 켜면 새로 쓴 글은 사라지고** 예시 글 4개로 돌아갑니다.

### 상대 시간 규칙 (`formatRelativeTime`)

| 경과 시간 | 표시 |
|---|---|
| 1분 미만 | 방금 전 |
| 1분 ~ 59분 | N분 전 |
| 1시간 ~ 23시간 | N시간 전 |
| 1일 ~ 6일 | N일 전 |
| 7일 이상 | M월 D일 |

## 실행 절차

사전 준비: [Node.js LTS](https://nodejs.org) 설치, 그리고 아래 둘 중 하나
- Android 에뮬레이터(Android Studio) 또는
- 스마트폰에 **Expo Go** 앱 설치 (PC와 같은 와이파이 필요)

```bash
cd app
npm install          # 처음 한 번 (패키지 설치, 몇 분 걸릴 수 있음)
npx expo start       # 개발 서버 시작
```

1. 터미널에서 **`a`** 키를 누르면 열려 있는 안드로이드 에뮬레이터의 Expo Go에서 앱이 실행됩니다.
2. 스마트폰이라면 터미널에 뜬 **QR 코드**를 Expo Go로 스캔합니다. 연결이 안 되면 `npx expo start --tunnel`
3. 코드를 수정해 저장하면 화면이 자동으로 갱신됩니다. 이상하면 `npx expo start -c` (캐시 삭제)

동작 확인 순서: 앱 실행 → 피드 확인 → 연필 버튼 → 내용 입력 → 게시 → 맨 위에 "방금 전" 글 확인 → 카드 탭 → 상세 확인

코드 검사 (오류 없이 끝남):

```bash
npx tsc --noEmit     # 타입 검사
npx expo lint        # 코드 스타일 검사
```

## 폴더 구조

```
app/
├─ package.json, app.json, tsconfig.json, eslint.config.js
├─ assets/                          앱 아이콘 등 이미지
└─ src/
   ├─ app/                          화면 주소만 정하는 파일 (Expo Router)
   │  ├─ _layout.tsx                폰트 로딩, 게시글 저장소(PostsProvider) 연결
   │  ├─ index.tsx                  피드 (첫 화면)
   │  └─ post/
   │     ├─ [id].tsx                상세
   │     └─ write.tsx               글쓰기
   ├─ features/posts/               게시글 기능 전부
   │  ├─ PostsProvider.tsx          게시글 목록 저장소 (addPost / getPost)
   │  ├─ seed.ts                    더미 데이터(예시 글 4개)
   │  ├─ types.ts                   Post 타입
   │  ├─ components/PostCard.tsx    게시글 카드
   │  └─ screens/                   FeedScreen, PostDetailScreen, WritePostScreen
   └─ shared/
      ├─ lib/time.ts                상대 시간 함수
      ├─ theme.ts                   색상·폰트·간격
      └─ ui/                        AppText, Button, Icon, IconBadge, Screen, TopBar, EmptyState
```

## 한계

- 서버·DB·로그인이 없어 데이터가 저장되지 않습니다 (앱 종료 시 초기화).
- 글쓰기에는 제목·사진·글자 수 표시가 없고 내용만 입력합니다 (요구 기능 범위에 한정).
- 안드로이드(에뮬레이터)에서 확인했으며 iOS는 확인하지 않았습니다.
