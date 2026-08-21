# RentMate 팀 운영 규칙 (2026-08-21 기준 — 사용자 확정 사항 집대성)

세션 3개(PM 1 + 구현 담당 2) 병렬 개발 체제의 운영 규칙. CLAUDE.md(코드 컨벤션·법적 제약)와 함께 모든 세션이 준수한다.

## 1. 체제

- **PM(리더) 1명 + 구현 담당 2명.** PM은 Fable, 워커는 Sonnet (토큰 관리 — 사용자 확정).
- 워커는 설계·보안·법적 판단을 자체 결정하지 않고 PM에게 **에스컬레이션**한다.
- 배정은 PM이 하고, 워커는 완료 시 **[리뷰 요청]**을 보낸다. 세션 간 소통은 SendMessage.
- 메인 체크아웃(dev 서버 :3000)은 담당2 소유. 다른 세션은 **git worktree** 분리(PM: ../rent-mate-reviews). worktree에서는 develop 체크아웃 불가 → 항상 `git checkout -b X origin/develop`으로 브랜치 생성.

## 2. PR·머지 (사용자 확정)

- **자기 PR은 리뷰 통과 후 스스로 즉시 머지**하고 [머지 통보] 1줄 발송. (CLAUDE.md의 "merge는 사람이" 규칙을 사용자가 이 방식으로 변경 확정)
- **교차 리뷰 필수**: 모든 PR은 작성자 아닌 1명이 리뷰 — ① 스키마·보안·결제·복잡 로직 = PM ② 사소한 UI·문구 = 다른 워커 ③ **PM의 PR = 시간 남는 워커**.
- **[머지 예약]**: 다른 세션과 경합하는 파일을 건드린 PR은 머지 직전 선언 → 상대 ack 후 머지. 먼저 머지한 쪽이 통보, 나중 쪽이 rebase.
- gh 계정이 공유(aabyess)라 GitHub 공식 approve 불가("자기 PR 승인 불가") — **메시지 기반 리뷰**가 공식 절차다.
- 커밋 전 검증 루틴: `tsc --noEmit` / `eslint` / `prettier` / `pnpm build`. 같은 체크아웃 공유 시 커밋 전 `git status` 확인 + pathspec으로 자기 파일만 커밋.
- 리뷰 지적사항은 "다음 터치"로 미루지 말고 **머지 전에 즉시 반영**이 기본 (사소한 것 포함).

## 3. 마이그레이션·DB

- **타임스탬프 예약은 [마이그레이션 통보] → 상대 ack 후 확정** (두 세션이 동번호를 고른 충돌 사례 있음 — ack 전 착수 금지, PM도 예외 아님).
- 번호 대역제(8/21 신설): 충돌이 잦으면 PM이 세션별 대역을 나눠준다 (예: 담당1 201000대 / 담당2 203000대 / PM 205000대).
- **CREATE OR REPLACE FUNCTION은 반드시 최신 버전 기반으로**: `grep -rn "<함수명>" supabase/migrations/`로 마지막 정의를 찾아 그 본문에 수정을 얹는다. 최초 버전 기반으로 쓰면 중간 마이그레이션의 변경이 조용히 증발한다 (#136에서 오버랩 사전 체크가 빠질 뻔한 실사례).
- **enum ADD VALUE는 단독 파일로 분리**: 새 값을 참조하는 정책·트리거의 문자열 본문은 같은 파일에 있어도 되지만, **partial index WHERE절·CHECK·즉시 실행 문장은 같은 트랜잭션에서 55P04로 실패**한다. ⚠️ `supabase db query` 리허설은 문장별 자동커밋이라 이 제약을 재현하지 못한다 — enum 관련은 리허설 통과를 믿지 말고 처음부터 파일 분리.
- push는 각자 `supabase db push --include-all --yes` (worktree는 `supabase link --project-ref xvnuvdsidzibpwrldink` 선행).
- 원격에만 적용되고 내 로컬에 없는 피어 마이그레이션 때문에 push가 막히면: 피어 브랜치에서 `git show origin/<branch>:<파일>`로 임시 복사 → push → 삭제 (피어 브랜치가 없으면 동일 버전명의 placeholder 파일).
- **BEGIN~ROLLBACK 리허설 필수**: `supabase db query --linked`에 stdin으로 SQL 전달. ⚠️ 멀티스테이트먼트에서 중간 에러가 삼켜질 수 있으니 케이스를 **statement별로 분리하고 select-back으로 실제 반영을 확인**한다.
- **파괴적 DB 적용(데이터 삭제 등)은 아무리 루틴이어도 리뷰 ack 후 실행.**
- RPC ACL: 함수는 기본으로 PUBLIC에 execute가 부여된다 — 반드시 `revoke ... from public, anon` + `grant ... to authenticated` 명시.
- 시크릿 비교 로직은 **값이 비어있는 케이스부터 체크** (`Bearer ${undefined}` 우회 사례).
- admin 권한 검증: **임시 admin 계정 생성 금지.** 실존 admin uid를 `set_config('request.jwt.claims', ...)` + `set local role authenticated`로 임퍼스네이션한 롤백 리허설 + 네거티브 컨트롤(비권한 uid로 차단 확인)로 검증.
- 계정 정리 배치 삭제 순서 템플릿: notifications(recipient FK non-cascade) → chat_reads(booking FK **RESTRICT**) → payments → chat_messages → reviews(**booking_id 조인 포함**) → reports(**booking_id 조인 포함**) → blocks → partner_likes/bookmarks → bookings → auth.users(cascade).
- QA 프로브 계정은 `qasweepNN@rentmate-id.com` 컨벤션, 쌓이면 다음 배치로 모아 정리. (현재 잔여: qasweep40~42, 50, 51)

## 4. 배포 (Vercel)

- develop 머지 = 프로덕션 자동 배포 (원격에 main 없음 — develop이 배포 브랜치).
- **vercel.json의 `ignoreCommand`(develop 외 브랜치 빌드 스킵)를 제거하지 말 것** — 프리뷰 빌드가 무료 한도(100회/일)를 소모해 프로덕션까지 막혔던 사고(2026-08-20)의 재발 방지 장치.
- 한도 초과 시 해제까지 약 24시간. **프로젝트 재생성은 계정 단위 한도라 무효.**
- **⚠️ 배포는 기본 OFF, 옵트인 방식이다 (8/21, [skip deploy] 옵트아웃 방식에서 전환)**: develop에 머지해도 커밋 메시지에 `[deploy]`가 명시적으로 없으면 빌드 자체가 스킵된다. 배포하려면 `gh pr merge --subject "... [deploy]"`.
  - 배경: 옵트아웃(기본 배포, 스킵 태그로 예외) 방식이었을 때, 태그를 도입하기 전 이미 40건 넘게 실빌드가 쌓여 **일일 배포 한도를 소진 → 실배포 완전 차단(24시간)** 사고가 났다 (8/21). "깜빡하면 배포됨"은 위험하고 "깜빡하면 안 됨"이 안전해서 기본값을 뒤집었다.
  - 운영: PM(리더)이 여러 머지를 모아뒀다가 **하루 몇 차례만, 사용자가 볼 필요가 있는 시점에** `[deploy]` 태그로 의도적으로 내보낸다. 워커는 기본적으로 태그 없이 머지(자동 스킵) — PM 지시 없이 임의로 `[deploy]` 태그를 붙이지 않는다.
  - ⚠️ PR 제목·본문에 "[deploy]" 문자열이 우연히 들어가면 머지 커밋에 섞여 의도치 않게 배포될 수 있다 — 무관한 PR에서 이 문자열 사용 금지.
  - 한도 소진 시 Vercel 커밋 상태 API로 정확한 원인 확인: `gh api repos/aabyess/rent-mate/commits/<sha>/status --jq '.statuses[]'` → `description`에 "Deployment rate limited — retry in 24 hours" 같은 원문이 그대로 나온다. 스킵된 커밋은 `"Canceled by Ignored Build Step"` / success로 구분된다.
- 공유 체크아웃에서 브랜치 전환은 남의 HEAD를 옮긴다 — **워커는 각자 git worktree에서 작업** (8/21부터 담당1: rent-mate-safety, 담당2: rent-mate-w2). 커밋 전 `git rev-parse --abbrev-ref HEAD`로 현재 브랜치 확인.
- 크론 리마인더: Vercel env `CRON_SECRET` 필요, `/api/reminders/run`은 인증 미들웨어 예외(PUBLIC_PATHS) — 자체 Bearer 검증.

## 5. 도메인·법적 (CLAUDE.md 보완 — 세션 간 합의사항)

- 금칙어: `utils/bannedPhrases.ts` ↔ DB `contains_banned_phrase()` **양측 동시 수정**. 공개 지면(프로필·후기·일기·예약 장소)은 DB 저장 거부, 채팅은 저장 허용+flagged(보존 의무).
- 덱: 틴더식 넘김 연출은 OK, **좋아요/거절 "판정" UI는 금지** (외모 평가 프레임 → 성인 서비스 연상 리스크).
- 신체 정보(키·몸무게): 상세에서만 절제 표시, **카드(덱) 노출 금지**.
- **파트너가 고객을 탐색·접근하는 구조 금지** (법적 오인·프라이버시) — 파트너는 블로그(일기)로 어필.
- 파트너 하단 탭·홈: 탐색 대신 [파트너 홈 | 내 블로그].
- 예약 코스 카테고리는 공개 장소 화이트리스트만 (밀실·숙박 성격 금지). 실비(입장료 등)는 고객 부담 고지 유지.
- 채팅 이미지: private 버킷 + signed URL만, 삭제 경로 없음(보존 의무).

## 6. 재화·정산 (사용자 확정 수치)

- **토큰 경제**: 웰컴 500 / 예약 신청 -10(부족 시 예약 차단) / 결제 후 데이트 완료 -100(부족 시 잔액만큼만, 완료는 진행) / 덱 되감기 -1. 충전(결제)은 미구현 — "준비 중" 안내.
- **플랫폼 수수료 5%** (PLATFORM_FEE_RATIO ↔ DB RPC 동기화). 취소 정책: 24h 전 무료 / 이내 50% / 시작 후 불가.
- v1 정산은 admin 수동 송금. **실서비스 전환 시 플랫폼 직접 보관·송금 금지 → PG 지급대행(분리정산)으로 대체** (전자금융거래법). 결제 PG는 토스페이먼츠(테스트 키), 실계약은 사업자등록 후.

## 7. 디자인

- 팔레트: 웜 코랄 #f26b4a + zinc 쿨 그레이 + trust teal. **크림/아이보리 배경 금지** ("AI 티" 피드백).
- 색은 hex 직접 금지 — 시맨틱 토큰 클래스(bg-surface, text-sub, bg-brand, bg-inverse 등). 상태색은 `-500/15` 배경 + `-500` 텍스트 패턴(다크모드 호환).
- 기준 문서: docs/design-guide.md (시안 캔버스 아티팩트는 폐기됨 — 실서비스 화면이 기준).

## 8. 남은 사용자 액션 (출시 게이트)

- PASS 본인인증 실연동 / 사업자등록 → 토스 실계약(지급대행 포함) / 스톡 사진 → 실파트너 교체 / 약관 법무 검토 / 파트너 원천징수(3.3%) 세무 확인 / Play Store 등록($25, 개인 계정 가능) / Sentry 도입(가입 필요).
