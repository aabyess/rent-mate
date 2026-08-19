# RentMate — Claude Project Instructions

Behavioral guidelines + project-specific conventions. Both sections apply at all times.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

---

## PART 1 — Behavioral Guidelines

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- Remove imports/variables that YOUR changes made unused; leave pre-existing dead code (mention it instead).

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- For multi-step tasks, state a brief plan with per-step verification before starting.

---

## PART 2 — Project Conventions

### Project Overview

**RentMate** — 일본의 렌탈 여자친구(レンタル彼女) 서비스를 모델로 한 시간제 데이트 동행 매칭 플랫폼.
고객이 파트너의 프로필을 보고 시간제로 데이트 동행을 예약·결제하는 서비스다.

**사용자 역할**

- `customer` — 데이트 동행을 예약하는 고객
- `partner` — 동행 서비스를 제공하는 파트너 (프로필·시간당 요금·가능 시간 등록)
- `admin` — 신고 처리, 파트너 승인, 콘텐츠 모니터링

**주요 도메인**

- 프로필/탐색: 파트너 프로필, 검색·필터
- 예약: 시간제 예약, 가능 시간 관리, 데이트 코스(공개 장소 위주)
- 결제: 시간제 요금 + 에스크로 (금액 계산은 `decimal.js`)
- 채팅: 예약 전후 커뮤니케이션 (Supabase Realtime)
- 신뢰/안전: 후기, 신고·차단, 관리자 모니터링

**법적 제약 (조사 결과 — 기능 설계에 반영, 위반 금지)**

한국에서 비성적 데이트 동행 자체는 합법(자유업)이지만, 아래 제약은 도메인 요구사항으로 취급한다:

1. **19세 이상 성인인증 필수** — 이성 만남 알선 앱은 청소년유해매체물 지정 대상. 미인증 운영 시
   운영자 형사처벌(청소년보호법). 가입 플로우에 성인인증 게이트를 반드시 둔다.
2. **기술적 안전조치 3종 필수** — ① 실명·휴대전화 인증 ② 채팅 대화 저장(삭제 불가 로그)
   ③ 신고 기능. 청소년유해매체물 예외 인정 요건이자 핵심 스펙.
3. **성적 서비스 완전 배제** — 성매매알선처벌법상 유사성행위 알선·광고도 처벌 대상.
   약관에 성적 서비스·신체접촉 금지를 명시하고, 조건만남 유도 채팅 감지·신고·제재 기능을 둔다.
   이를 연상시키는 문구·이미지·마케팅 카피도 금지.
4. **안전 장치** — 파트너 보호를 위한 긴급 신고, 후기·블랙리스트, 공개 장소 위주 데이트 코스.

### Stack (versions are fixed — do not deviate)

| Category               | Library                     | Version                                        |
| ---------------------- | --------------------------- | ---------------------------------------------- |
| Framework              | Next.js                     | 16 (App Router)                                |
| Language               | TypeScript                  | ^5                                             |
| CSS                    | Tailwind CSS                | ^4                                             |
| Database/Auth/Realtime | Supabase                    | latest (@supabase/supabase-js + @supabase/ssr) |
| Client state           | Zustand                     | ^5                                             |
| Server state           | @tanstack/react-query       | ^5                                             |
| Animation              | motion                      | ^13                                            |
| UI primitives          | @headlessui/react           | ^2                                             |
| Package manager        | pnpm                        | (never npm or yarn)                            |
| Deploy                 | Vercel                      |                                                |
| Lint/format            | ESLint ^9 + Prettier ^3     |                                                |
| Style utils            | clsx + cva + tailwind-merge |                                                |

### Folder Structure

```
app/
  (auth)/            ← 인증 페이지 그룹
  (main)/            ← 서비스 페이지 그룹 — 하위 폴더: kebab-case
  layout.tsx
  page.tsx

components/
  ui/                ← 원자 UI: Button, Input, Badge, Modal ...
  commons/           ← 도메인 무관 재사용 컴포넌트
  layout/            ← Header, Sidebar, Footer

features/            ← 하위 폴더: camelCase
  shared/components/ ← 여러 feature가 공유하는 도메인 컴포넌트
  <camelCase>/
    components/
    apis.ts
    queries.ts
    mutations.ts
    hooks.ts
    types.ts
    utils.ts

libs/                ← 라이브러리 설정: queryClient, supabase ...
utils/  hooks/  store/  types/  constants/
```

### Naming Rules

| Target                | Rule                       | Example                     |
| --------------------- | -------------------------- | --------------------------- |
| `app/` 하위 폴더      | kebab-case                 | `order-history/`            |
| `features/` 하위 폴더 | camelCase                  | `orderBook/`                |
| 컴포넌트 파일         | PascalCase                 | `OrderBook.tsx`             |
| 훅 파일               | camelCase + `use`          | `useOrderBook.ts`           |
| util/api/type 파일    | camelCase                  | `apis.ts`, `formatPrice.ts` |
| Zustand 스토어        | camelCase + `use`          | `useMarketStore.ts`         |
| 변수                  | camelCase / 상수           | UPPER_SNAKE_CASE            |
| 핸들러                | `handle` 접두사            | `handleButtonClick`         |
| API 함수              | 메서드 접두사              | `getOrderList`, `postOrder` |
| 불리언                | `is`/`has` 접두사          | `isLoading`, `hasError`     |
| 이미지                | `ic`(아이콘)/`img`(이미지) | `icArrow.svg`               |

### Component Splitting Rule

하위 컴포넌트는 부모 폴더 안에 형제 파일로 둔다. 중첩 폴더 금지.
파일명: 부모 컴포넌트 이름 접두사 + PascalCase.

```
# Correct
OrderBook/
  index.tsx           ← 진입점
  OrderBookAsk.tsx    ← 하위 (부모 접두사)
  OrderBookBid.tsx

# Forbidden
OrderBook/sub/Ask.tsx ← 중첩 폴더 금지
```

### Function Declaration Rule

모든 함수는 함수 선언식. 화살표 함수 금지.

```ts
// Correct
function OrderBook({ symbol }: OrderBookProps): JSX.Element { ... }
// Forbidden
const OrderBook = ({ symbol }: OrderBookProps) => { ... }
```

### Style Rules

- 클래스 병합은 `cn()`(clsx + tailwind-merge), 변형은 `cva`.
- 인라인 삼항 클래스 전환 금지.
- Tailwind v4: 커스텀 토큰은 `globals.css`의 `@theme {}`. `tailwind.config.ts` 사용 금지. `@apply` 최소화.

### Prettier Rules

```js
{
  arrowParens: "always", bracketSameLine: true, bracketSpacing: true,
  trailingComma: "all", singleQuote: false, semi: true,
  useTabs: true, tabWidth: 2, printWidth: 100, endOfLine: "auto",
  plugins: ["prettier-plugin-tailwindcss"]
}
```

### Git Flow

```
main      ← 배포 브랜치 (직접 push 금지)
develop   ← 개발 통합 브랜치
feat/xxx  ← 기능 브랜치 (kebab-case)
fix/xxx   ← 버그 수정 브랜치
```

- 작업마다 새 브랜치 → PR 생성까지가 에이전트의 몫. **merge는 사람이 직접 한다.**
- merge 후에는 커밋 해시가 main에 포함됐는지 확인한다 (merge 타이밍 어긋남으로 커밋이 누락될 수 있음).
- 여러 세션/터미널이 같은 체크아웃을 공유하면, 커밋 전 `git status`로 남의 작업이 섞이지 않는지 확인하고 pathspec으로 자기 파일만 커밋한다.

### State Management Rules

**Server state — TanStack Query v5**

- 모든 서버 데이터는 TanStack Query. 예외 없음. v5 API만 사용.
- Query 키는 `features/<name>/queries.ts`에 상수로, mutation은 `mutations.ts`에.

**Client state — Zustand v5**

- 전역 UI 상태·세션만. 서버 데이터 금지. 스토어는 `store/`에만, 내부에 async fetch 금지.

**Supabase**

- 실시간 기능은 Supabase Realtime.
- 보안 키 클라이언트 노출 금지. RLS 필수.
- 남의 행에 쓰는 작업(알림, 시스템 메시지 등)은 API 라우트에서 admin 클라이언트로 처리하고, 실패해도 본 작업을 롤백하지 않고 로그만 남긴다.
- 스키마 변경은 반드시 `supabase/migrations/` 파일로 남긴다. 여러 테이블을 함께 바꾸는 원자적 작업은 DB 함수(RPC)로 만들어 호출한다.

### TypeScript Rules

- `any` 금지. 불가피하면 `unknown` + 타입 가드.
- `type` 우선. `interface`는 명시적 확장에만.
- Props 타입명 = 컴포넌트명 + `Props`.
- 모든 함수에 명시적 반환 타입.

### Import Path Rules

절대경로 alias만 사용 (`@/...`). 3단계 이상 상대경로 금지.

### Verification Routine (커밋 전 필수)

```
pnpm exec tsc --noEmit
pnpm exec eslint <변경 경로>
pnpm exec prettier --write <변경 경로>
pnpm build            # 배포 전
```

### Code Generation Rules

1. 파일 1행에 경로 주석: `// features/orderBook/components/OrderBook/index.tsx`
2. 금액 등 금융 값에 plain `number` 연산 금지 — `decimal.js` 사용.
3. 새 패키지가 필요하면 먼저 이름을 밝히고 `pnpm add` 명령을 제시한다.
4. 기존 코드와 충돌할 수 있는 변경은 작성 전에 물어본다.
