# 잼타 할 일 앱 (MP1 · 할 일 앱 화면 만들기)

할 일 **목록, 추가 입력, 완료 토글, 빈 상태 화면**을 React Native(Expo)로 구현한 과제물입니다.
서버 없이 **앱 메모리(인메모리 상태)** 로만 동작하며, 앱을 다시 실행하면 데이터가 사라집니다. 저장은 MP2, 통계는 MP3에서 이 화면 위에 이어서 구현합니다.

| 항목 | 내용 |
|---|---|
| 프레임워크 | React Native 0.88 + Expo SDK 58 |
| 언어 | TypeScript |
| 화면 이동 | Expo Router (파일 기반 라우팅) |
| 아이콘 / 폰트 | lucide-react-native / Jua, Noto Sans KR |
| 상태 관리 | React Context + `useReducer` (인메모리) |
| 디자인 | 팀 디자인 파일 `JamSNS.pen`의 색상·폰트·카드 스타일 |

## 구현 기능 목록

| 기능 | 동작 | 구현 위치 |
|---|---|---|
| 할 일 목록 | 추가한 할 일이 카드 형태로 세로 스크롤 목록에 표시됩니다. 최신 항목이 맨 위에 옵니다. | `screens/TodoListScreen.tsx`, `components/TodoItem.tsx` |
| 할 일 추가 | 입력창에 내용을 쓰고 `+` 버튼 또는 키보드 완료 키를 누르면 목록 맨 위에 추가됩니다. | `components/TodoInput.tsx` → `TodosProvider`의 `addTodo` |
| 입력 검증 | 공백만 입력하면 추가되지 않습니다. 이때 `+` 버튼은 비활성화(연한 색)됩니다. 최대 50자까지 입력할 수 있습니다. | `TodoInput.tsx`, `todosReducer.ts` |
| 완료 토글 | 카드를 탭하면 완료와 미완료가 즉시 바뀝니다. 완료된 항목은 체크 표시, 취소선, 흐린 글자로 표시됩니다. | `TodoItem.tsx` → `toggleTodo` |
| 삭제 | 카드 오른쪽 휴지통 아이콘을 누르면 해당 항목이 삭제됩니다. | `TodoItem.tsx` → `removeTodo` |
| 진행 현황 | 입력창 아래에 `남은 할 일 n개`, `완료 n개`가 실시간으로 표시됩니다. | `TodoListScreen.tsx` |
| 빈 상태 안내 | 할 일이 0개이면 "아직 할 일이 없어요" 안내 화면이 표시됩니다. | `shared/ui/StateViews.tsx`의 `EmptyState` |

## 화면 구성

앱은 화면 하나(`/`, 앱을 켜면 첫 화면)로 이루어져 있으며, 위에서 아래로 다음 요소가 배치됩니다.

1. **상단바**: 흰 배경에 Jua 폰트로 제목 "오늘의 할 일"과 부제가 표시됩니다.
2. **입력 카드**: 흰 카드(모서리 16, 테두리 `#DCE3F0`) 안에 입력창과 파란 `+` 버튼이 있습니다.
3. **진행 현황 칩**: 파란 칩에 남은 할 일 수, 초록 칩에 완료한 할 일 수가 표시됩니다.
4. **할 일 목록**: 각 카드는 체크 원, 내용, 휴지통 아이콘으로 구성됩니다.
5. **빈 상태**: 목록이 비어 있으면 클립보드 아이콘 배지, 안내 제목, 설명 문구가 표시됩니다.

| 상태 | 설명 | 스크린샷 |
|---|---|---|
| 빈 상태 | 처음 실행했을 때 할 일이 0개인 화면 | `screenshots/01_empty.png` |
| 추가 | 입력창에 할 일을 입력하는 중인 화면 (`+` 버튼 활성화) | `screenshots/02_add.png` |
| 목록 | 할 일 여러 개가 추가된 목록 화면 | `screenshots/03_list.png` |
| 완료 | 일부 항목을 탭해 완료로 바꾼 화면 (체크, 취소선, 완료 개수 증가) | `screenshots/04_done.png` |

## 데이터 구조

할 일 한 개의 모양 (`app/src/features/todos/types.ts`):

```ts
interface Todo {
  id: string;        // 고유 값. 예) "todo-1731200000000-0"
  title: string;     // 할 일 내용 (앞뒤 공백 제거, 최대 50자)
  done: boolean;     // 완료 여부
  createdAt: string; // 만든 시각 (ISO 문자열)
}
```

- **상태 변경 규칙** (`todosReducer.ts`): 화면과 분리된 순수 함수이며, 아래 세 가지 동작을 처리합니다.
  - `add`: 공백을 제거한 뒤 내용이 비어 있으면 무시하고, 그렇지 않으면 목록 **맨 앞**에 추가합니다.
  - `toggle`: id가 같은 항목의 `done` 값을 반대로 바꿉니다.
  - `remove`: id가 같은 항목을 목록에서 제거합니다.
- **저장소** (`TodosProvider.tsx`): `todos`, `addTodo`, `toggleTodo`, `removeTodo`를 앱 전체에 제공합니다.
- 예시(더미) 데이터 없이 **빈 목록으로 시작**합니다. 그래서 첫 화면에서 빈 상태 안내를 바로 확인할 수 있습니다.

## 실행 절차

### 버전
| 항목 | 버전 |
|---|---|
| Expo SDK | 58 (`expo` 58.0.23) |
| React Native | 0.88.1 |
| React | 19.3.0 |
| Node.js | 24.11.0 (LTS 20 이상이면 실행 가능) |
| 잠금 파일 | `app/package-lock.json` 포함 |

### 실행 기기
- 확인한 환경: Windows PC + Chrome 웹 실행(Expo 웹), Chrome 개발자 도구 모바일 화면 모드 **iPhone 12 Pro(390×844)**
- 같은 코드로 Android 에뮬레이터 또는 실기기의 **Expo Go(SDK 58)** 에서도 실행할 수 있습니다.

### 실행 명령
```bash
cd app
npm install
npx expo start
```

- **웹(확인한 방법):** `npx expo start` 실행 후 터미널에서 `w` 키 → 브라우저에서 `http://localhost:8081` 이 열림 → F12 → Ctrl+Shift+M → Dimensions에서 iPhone 12 Pro 선택
- **Android 에뮬레이터:** 에뮬레이터를 켠 뒤 터미널에서 `a` 키
- **실기기:** 휴대폰에 Expo Go(SDK 58) 설치 → 터미널의 QR 코드 스캔 (PC와 같은 와이파이, 안 되면 `npx expo start --tunnel`)
- 화면이 이상하면 `npx expo start -c` 로 캐시를 지우고 다시 실행합니다.

코드 검사:

```bash
npx tsc --noEmit
```

## 확인 방법

### 추가·완료 토글

- 조작: 입력창에 `고모프 과제 제출하기`를 입력하고 `+`를 누른다. 같은 방법으로 `도서관 책 반납`, `자료구조 복습`, `팀 회의 준비`를 추가한 뒤, `고모프 과제 제출하기`와 `도서관 책 반납` 카드를 누른다. 같은 카드를 한 번 더 누른다.

- 기대 결과: 입력하면 `+` 버튼이 진한 파란색으로 바뀌고, 누르면 할 일이 목록 맨 위에 추가되며 "남은 할 일 n개"가 늘어난다. 카드를 누르면 체크 표시와 취소선이 생기고 "남은 할 일 2개 / 완료 2개"가 된다. 한 번 더 누르면 미완료로 돌아온다.

- 스크린샷: 02_add.png, 03_list.png, 04_done.png

### 빈 상태 안내

- 조작: 앱을 처음 실행한다. 할 일을 추가한 상태에서 휴지통 아이콘을 눌러 모두 삭제한다.

- 기대 결과: 할 일이 0개이면 "아직 할 일이 없어요" 안내와 "위 입력창에 할 일을 적고 + 버튼을 눌러 추가해 보세요" 문구가 표시된다. 공백만 입력하면 `+` 버튼이 비활성화되어 추가되지 않는다.

- 스크린샷: 01_empty.png

### 입력 데이터·스크린샷 개인정보 없음

- 조작: 위 확인에 사용한 입력값과 screenshots/ 폴더의 이미지를 확인한다.

- 기대 결과: 입력값은 일반적인 할 일 문장뿐이고, 실명·연락처·주소·실제 인물 사진이 없다.

- 스크린샷: 01_empty.png, 02_add.png, 03_list.png, 04_done.png

시험 데이터: 앱 안에 저장된 더미 데이터 없음(빈 목록으로 시작). 확인할 때 입력한 값은 `고모프 과제 제출하기`, `도서관 책 반납`, `자료구조 복습`, `팀 회의 준비`

네트워크: 불필요(앱이 서버를 쓰지 않음). 단, Expo 개발 서버로 실행할 때는 PC와 기기가 같은 네트워크에 있어야 함

## 폴더 구조

```
app/
├─ package.json, app.json, tsconfig.json, eslint.config.js
├─ assets/                            앱 아이콘 등 이미지
└─ src/
   ├─ app/                            화면 주소만 정하는 파일 (Expo Router)
   │  ├─ _layout.tsx                  폰트 로딩, 할 일 저장소(TodosProvider) 연결
   │  └─ index.tsx                    할 일 목록 (첫 화면)
   ├─ features/todos/                 할 일 기능 전부
   │  ├─ TodosProvider.tsx            할 일 저장소 (addTodo / toggleTodo / removeTodo)
   │  ├─ todosReducer.ts              상태 변경 규칙 (순수 함수)
   │  ├─ types.ts                     Todo 타입
   │  ├─ components/                  TodoInput(추가 입력), TodoItem(할 일 카드)
   │  └─ screens/TodoListScreen.tsx   목록 화면
   └─ shared/                         팀 공통 (미니피드 MP1과 같은 디자인 토큰·UI 부품)
      ├─ theme.ts                     색상·폰트·간격
      └─ ui/                          AppText, Button, Icon, IconBadge, Screen, TopBar, EmptyState
```

## 민감정보

- API 키, `.env` 파일, 실명, 연락처 등 개인정보는 포함하지 않았습니다. 서버와 외부 API도 사용하지 않습니다.
- `node_modules`, `.expo`, 빌드 결과물은 제출 ZIP에서 제외했습니다.

## 한계

- 데이터가 앱 메모리에만 있어서 앱을 종료하면 초기화됩니다. 기기 저장은 MP2 범위입니다.
- 할 일 수정, 정렬 변경, 마감일 기능은 없습니다 (MP1 요구 범위에 한정).
