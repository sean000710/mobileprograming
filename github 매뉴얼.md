# 고모프 프로젝트 협업 규칙

버전 통일 :
* 파이썬은 3.11.8  버전으로 통일 (미정)

## 브랜치 구조

```text
main
develop
feature/*
```

### 브랜치 역할

* **main** : 최종 배포 및 시연 가능한 안정 버전
* **develop** : 기능 통합 및 테스트 브랜치
* **feature/*** : 개별 기능 개발 브랜치

---

## 브랜치 사용 규칙

### 금지 사항

* main 브랜치 직접 작업 금지
* main 브랜치 직접 push 금지
* develop 브랜치 직접 개발 및 push 금지

### 개발 원칙

모든 개발은 담당 feature 브랜치에서 진행합니다.

예시

```text
feature/telegram-collector
feature/darkweb-collector
feature/dashboard-ui
feature/threat-analyzer
```

새 브랜치를 만든 경우 채팅방에 공유

---

## 작업 시작 절차

## 작성자 정보가 없다고 나온 경우

```bash
git config --global user.name "본인이름/닉네임"
git config --global user.email "깃허브이메일"
```

### 1. develop 최신화. 작업을 하기 전 실시
// 자신이 작업하고 있는 명확한 브랜치가 있으면 안해도 됨.

```bash
git checkout develop
git pull origin develop
```

### 2-A. 담당 브랜치로 이동

```bash
git checkout feature/브랜치명
```

### 2-B. 새 작업을 위한 브랜치 만들기
(* 단 이렇게 하면 개인 로컬에만 브랜치가 생깁니다.)

```bash
git checkout -b feature/새 브랜치
```

### 3. 작업 시작

기능 구현 및 수정 진행

---

## 작업 종료 절차

### 1. 변경 사항 확인

```bash
git status
```

### 2. 커밋

```bash
git add .
git commit -m "작업 내용"
```

예시

```text
Add telegram collector
Implement IOC extraction
Fix dashboard chart bug
```

### 3. 원격 저장소 업로드 

자신의 로컬 브랜치를 처음 올리는 경우 --> 이러면 남들도 이 브랜치에 접근 가능
```bash
git push -u origin feature/새로 작업한 브랜치
```

이미 원격 브랜치가 존재하는 경우
```bash
해당 브랜치 위치에서
git push
```

### 4. Pull Request 생성  (병합하고 싶을 때)

GitHub에서 본인 브랜치 → develop 대상으로 PR 생성

---

## Pull Request 규칙

PR 생성 시 아래 내용을 반드시 작성합니다.

* 작업 내용
* 주요 변경 사항
* 테스트 여부
* 참고 사항

PR 생성 후 저장소 관리자 확인 및 승인 후 merge합니다.

---

## 커밋 메시지 규칙

좋은 예시

```text
Add telegram collector
Implement threat analyzer
Fix database connection bug
Update dashboard UI
```

지양할 예시

```text
수정
update
test
123
```

---

## 충돌(Conflict) 발생 시

충돌 발생 시 임의로 해결하지 말고 즉시 팀원 공유
****   --force 키워드로 강제 push 금지 ****
---

## Main 브랜치 반영 기준

아래 조건을 만족할 경우에만 develop → main 병합을 진행합니다.

* 기능 정상 동작 확인
* 치명적 오류 없음
* 시연 가능 상태
* 팀 내 공유 완료

```text
feature/*
      ↓
   develop
      ↓
     main
```

main 브랜치는 항상 시연 가능한 상태를 유지합니다.

---
