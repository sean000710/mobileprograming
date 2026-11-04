# 잼타(JamSNS) 프론트엔드

React Native(Expo SDK 58) + Expo Router + TypeScript

지금은 **게시글 피드 기능 하나**만 들어 있어요. (서버 연결 없음, 데이터는 앱 메모리에 저장)

## 구현된 기능
| 기능 | 위치 |
|---|---|
| 게시글 카드(닉네임 · 작성 시각 · 내용)로 된 스크롤 피드 | `src/features/posts/screens/FeedScreen.tsx`, `components/PostCard.tsx` |
| 글쓰기 → 작성한 글이 피드 **맨 위**에 추가 | `screens/WritePostScreen.tsx`, `PostsProvider.tsx` (`addPost`) |
| 게시글을 누르면 상세 화면으로 이동 | `screens/PostDetailScreen.tsx` |
| 작성 시각을 "5분 전" 같은 상대 시간으로 표시 | `src/shared/lib/time.ts` (`formatRelativeTime`, `useNow`) |

## 실행하기
```bash
cd frontend
npm install        # 처음 한 번
npx expo start     # 터미널에서 a 키 = 안드로이드 에뮬레이터, 또는 폰의 Expo Go 로 QR 스캔
```
- 코드를 저장하면 화면이 자동으로 새로고침돼요. 이상하면 `npx expo start -c`
- 작업 끝나고: `npm run typecheck` 와 `npm run lint` 가 오류 없이 끝나는지 확인

## 폴더 구조
```
src/
├─ app/                      화면 "주소"만 정하는 파일 (한 줄짜리)
│  ├─ _layout.tsx            앱 전체 틀 (폰트, 게시글 저장소)
│  ├─ index.tsx              피드 (앱을 켜면 첫 화면)
│  └─ post/
│     ├─ [id].tsx            게시글 상세
│     └─ write.tsx           글쓰기
├─ features/posts/           ★ 게시글 기능 전부
│  ├─ PostsProvider.tsx      게시글 목록 저장소 (addPost, getPost)
│  ├─ seed.ts                처음 보이는 예시 글 4개
│  ├─ types.ts               Post 모양 (id, nickname, content, createdAt)
│  ├─ components/PostCard.tsx
│  └─ screens/               FeedScreen, PostDetailScreen, WritePostScreen
└─ shared/
   ├─ ui/                    AppText, Button, Icon, IconBadge, Screen, TopBar, EmptyState
   ├─ lib/time.ts            상대 시간 함수
   └─ theme.ts               색상 / 폰트 / 간격 (JamSNS.pen 과 동일)
```

## 알아 둘 점
- 새 글의 작성자 닉네임은 **고정값**이에요 (`PostsProvider.tsx` 의 `MY_NICKNAME`). 로그인이 없기 때문입니다.
- 앱을 **완전히 껐다 켜면** 새로 쓴 글은 사라지고 예시 글 4개로 돌아가요. 서버나 저장소를 붙이면 해결돼요.
- 글자는 `Text` 대신 `AppText`, 색은 `theme.ts` 의 `colors.*` 를 쓰면 디자인과 맞춰져요.
- 패키지는 `npm install` 대신 `npx expo install 패키지명` 으로 추가하세요.
