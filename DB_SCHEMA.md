# JamSNS (잼타) DB 테이블 설계 정리

> 출처: `JamSNS.pen` 디자인 화면 17개 분석 (2026-10-07)
> 화면: 로그인, 회원가입, 게시판 선택(+학부모 차단), 홈 피드(+작성 제한 오류/신고 모달/신고 사유), 게시물 상세, 글쓰기(+오류/부적절 내용), 쪽지(받은/보낸), 채팅방, 마이페이지

---

## 1. 핵심 테이블

### 1) `schools` — 학교 찾기, 지역 학교 게시판
| 컬럼 | 비고 |
|---|---|
| id | PK |
| name | 학교 이름 |
| region | 지역 학교 게시판 묶음 기준 |
| address | |
| school_level | 초/중/고 |

### 2) `users`
| 컬럼 | 비고 |
|---|---|
| id | PK |
| phone | UNIQUE, 로그인 ID (전화번호 + 비밀번호 로그인) |
| password_hash | |
| school_id | FK → schools |
| grade | 마이페이지 "잼타고등학교 · 2학년" |
| nickname | "열정만점잼타", [변경] 버튼 |
| role | STUDENT / PARENT / TEACHER ("담당 선생님" 쪽지 존재) |
| student_verified | 학생 인증 여부 |
| parent_verified | 학부모 게시판 접근 조건 (미인증 시 차단 모달) |
| anonymous_default | bool, 마이페이지 "익명으로 표시하기" 토글 |
| default_board_type | "나중에 설정에서 바꿀 수 있어요" |
| profile_image_url | |
| created_at | |

### 3) `boards` — 게시판 선택 화면의 3종류
| 컬럼 | 비고 |
|---|---|
| id | PK |
| type | SCHOOL / REGION / PARENT |
| school_id | nullable (학교 게시판) |
| region | nullable (지역 게시판) |
| name | |

### 4) `posts`
| 컬럼 | 비고 |
|---|---|
| id | PK |
| board_id | FK → boards |
| author_id | FK → users |
| title | |
| content | 최대 1000자 ("0 / 1000") |
| is_anonymous | 글 단위 저장 (피드 "익명" 표시) |
| like_count | 비정규화 카운터, 🔥 인기 게시물 정렬용 |
| comment_count | 비정규화 카운터 |
| status | ACTIVE / HIDDEN(신고 누적) / DELETED |
| created_at | "5분 전" 표시, 작성 횟수 제한 판단 |

### 5) `post_images` — 사진 첨부 최대 5장 ("0 / 5")
| 컬럼 | 비고 |
|---|---|
| id | PK |
| post_id | FK → posts |
| image_url | |
| sort_order | |

### 6) `post_likes` — 게시물 하트
| 컬럼 | 비고 |
|---|---|
| user_id | PK(user_id, post_id) |
| post_id | |
| created_at | |

### 7) `comments`
| 컬럼 | 비고 |
|---|---|
| id | PK |
| post_id | FK → posts |
| author_id | FK → users |
| content | |
| is_anonymous | |
| like_count | 댓글별 하트 숫자 (5, 2, 0) |
| status | |
| created_at | |
| parent_id | (선택) 대댓글 도입 시 |

### 8) `comment_likes` — 댓글 하트
| 컬럼 | 비고 |
|---|---|
| user_id | PK(user_id, comment_id) |
| comment_id | |
| created_at | |

### 9) `reports` — 신고 모달
| 컬럼 | 비고 |
|---|---|
| id | PK |
| reporter_id | FK → users |
| target_type | POST / COMMENT / MESSAGE |
| target_id | |
| reason | 욕설/비방, 스팸/광고, 부적절한 사진, 허위 정보, 기타 |
| detail | 기타 사유 입력 |
| status | PENDING / RESOLVED / REJECTED ("검토 후 조치할게요") |
| created_at | |

- 중복 신고 방지: UNIQUE(reporter_id, target_type, target_id)

### 10) `conversations` — 쪽지/채팅방 단위
| 컬럼 | 비고 |
|---|---|
| id | PK |
| user_a_id | FK → users |
| user_b_id | FK → users |
| last_message_at | 목록 정렬용 |

### 11) `messages`
| 컬럼 | 비고 |
|---|---|
| id | PK |
| conversation_id | FK → conversations |
| sender_id | FK → users |
| content | |
| read_at | 읽음 처리 |
| deleted_by_sender | |
| deleted_by_receiver | |
| created_at | "오후 3:12" 표시 |

- 받은 쪽지 / 보낸 쪽지 탭은 `sender_id` 필터로 구분하므로 테이블을 따로 두지 않는다.

### 12) `notices` — 홈 상단 배너 ("9월 정기고사 시간표가 안내되었어요")
| 컬럼 | 비고 |
|---|---|
| id | PK |
| school_id | FK → schools |
| title | |
| content | |
| starts_at / ends_at | 노출 기간 |

---

## 2. 상황에 따라 추가할 테이블

| 테이블 | 근거 |
|---|---|
| `refresh_tokens` / `sessions` | 로그인 "로그인 상태 유지" |
| `verifications` | 학생/학부모 인증 신청·심사 (type, status, 증빙 파일) |
| `banned_words` (+ `moderation_logs`) | "부적절한 내용이 포함되어 게시할 수 없습니다" 오류. 외부 AI 필터를 쓰면 불필요 |
| `school_events` | 하단 탭 "캘린더" (디자인 화면은 아직 없음) |

---

## 3. 테이블 없이 처리하는 기능

- **게시글 작성 횟수 제한**: `posts`에서 author_id와 최근 N분 이내 created_at으로 개수 조회 (또는 Redis rate limit)
- **마이페이지 "내 활동"**: `posts` + `comments`를 UNION해서 최신순 정렬

---

## 4. 확인 필요 사항 (디자인과 기능이 어긋나는 부분)

1. 로그인 화면 문구는 "학교 이메일로 가입"인데 입력칸은 **전화번호**다. 이메일 인증을 하려면 `users.school_email`과 이메일 인증 테이블이 추가로 필요하다.
2. 피드에는 **"익명"**, 상세 화면에는 **실명(김도윤)**이 표시된다. 익명 글을 상세 화면에서도 익명으로 보여줄지 결정해야 `is_anonymous` 처리 방식이 확정된다.

---

## 5. 관계 요약

```
schools 1─N users
schools 1─N boards (SCHOOL)
boards  1─N posts
users   1─N posts / comments / reports
posts   1─N post_images / comments / post_likes
comments 1─N comment_likes
conversations 1─N messages
users  N─N users (via conversations)
schools 1─N notices
```
