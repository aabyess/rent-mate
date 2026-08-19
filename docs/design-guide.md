<!-- docs/design-guide.md -->

# RentMate 디자인 가이드

시간제 데이트 동행 매칭 플랫폼 RentMate의 디자인 리서치 결과물.
컬러 토큰은 Tailwind v4 `@theme {}`에 그대로 옮길 수 있는 형태로 정리했다.

> **법적 제약이 디자인에 미치는 영향 (CLAUDE.md 기준)**
>
> - 유흥업소/성인 서비스를 연상시키는 비주얼(빨강·보라 네온, 어두운 배경, 선정적 이미지) **절대 금지**. 청소년유해매체물·성매매알선 광고 리스크와 직결된다.
> - 신고 버튼·안전 안내·성인인증 배지는 "숨겨진 기능"이 아니라 **눈에 띄는 1급 UI 요소**로 취급한다 (기술적 안전조치 3종이 법적 요건).
> - 마케팅 카피·일러스트·사진 가이드도 동일 기준: "설렘·동행·취미 공유" 톤은 OK, "밤·은밀함·스킨십" 뉘앙스는 전면 금지.

---

## ① 무드 & 컨셉 요약

**키워드: "낮의 데이트" — 신뢰감 + 따뜻함, 청결하고 밝은 톤.**

- **밝은 배경 + 따뜻한 포인트 컬러.** 일본 렌탈카노조 1위권 사이트(코이카노 등)도 실제로 흰 배경 + 연한 핑크의 밝고 부드러운 톤을 쓴다. 다만 핑크를 그대로 가져오면 국내에서는 성인 서비스로 오독될 여지가 있어, RentMate는 핑크에서 오렌지 쪽으로 이동한 **코랄**을 주조색으로 쓴다 (따뜻함·친근함은 유지, 유흥 뉘앙스는 제거).
- **신뢰는 청록(teal)으로.** 헬스케어·서비스 브랜딩에서 신뢰·안정은 블루-그린 계열이 담당한다. 인증 배지, 안전 관련 UI, 보조 액션에 teal을 배정해 "검증된 플랫폼" 인상을 만든다.
- **여백과 라이트 그레이.** 캐치테이블이 여백과 톤으로 고급감을 만드는 방식을 참고 — 카드·섹션 사이 여백을 넉넉히, 구분선 대신 배경 톤 차이(흰색 vs 라이트 쿨 그레이)로 구획한다.
- **사진이 주인공, UI는 조연.** Tinder/Bumble처럼 프로필 사진을 크게, 텍스트는 최소로. 단 스와이프식 "외모 평가" 프레임 대신 에어비앤비식 "리스팅 탐색" 프레임(그리드 + 필터 + 상세)을 기본으로 한다 — 시간제 예약 상품이라는 성격에 더 맞고, 성인 서비스 연상도 피한다.
- **다크 모드는 "어두운 유흥 톤"이 아니라 OS 설정 대응.** 순검정 대신 짙은 쿨 그레이(zinc) 다크 서피스를 쓰고, 네온·글로우 효과는 라이트/다크 모두 금지.

---

## ② 컬러 팔레트

### 선정 근거

- **Primary — Warm Coral**: 따뜻함·환대·에너지. 헬스케어 UI 트렌드에서도 "부담스럽지 않은 따뜻함"으로 코랄·피치가 쓰인다. 에어비앤비(Rausch)가 검증한 "숙박·만남 서비스 + 코랄 계열" 조합.
- **Secondary — Trust Teal**: 신뢰·안정·차분함. 블루의 신뢰와 그린의 안전을 잇는 색. 인증·안전·보조 버튼 담당.
- **Accent — Apricot Amber**: 뱃지·하이라이트·프로모션용 포인트. 주조색과 같은 온도의 노랑 계열이라 화면이 따뜻하게 유지된다.
- **상태색**: 관용적 의미(초록=성공, 호박=경고, 빨강=오류)를 따르되 채도를 한 단계 낮춰 네온 느낌을 없앤다. Error 빨강은 primary 코랄과 혼동되지 않도록 순빨강 쪽으로 분리했다.
- **Neutral**: **쿨 그레이(zinc 계열) + 순백 배경**. 초기안은 웜 그레이(stone)였으나, 크림 배경 + 코랄 조합이 Claude/Anthropic 브랜드를 연상시킨다는 피드백으로 쿨 그레이로 교체했다. 따뜻함은 코랄·앰버 포인트가 담당하고, 바탕은 중립을 유지한다. 크림/아이보리 톤(`#faf9f7` 류) 배경 사용 금지.

### Tailwind v4 `@theme` 토큰 (globals.css에 그대로 복사 가능)

```css
@theme {
	/* Primary — Warm Coral */
	--color-primary-50: #fff5f2;
	--color-primary-100: #ffe8e1;
	--color-primary-200: #ffd0c2;
	--color-primary-300: #ffab93;
	--color-primary-400: #fb8666;
	--color-primary-500: #f26b4a; /* 메인. CTA, 활성 상태 */
	--color-primary-600: #dd5230;
	--color-primary-700: #b83f23;
	--color-primary-800: #963621;
	--color-primary-900: #7a3020;

	/* Secondary — Trust Teal */
	--color-secondary-50: #f0faf9;
	--color-secondary-100: #d5f1ef;
	--color-secondary-200: #aee3e0;
	--color-secondary-300: #7ecfcb;
	--color-secondary-400: #4bb3b0;
	--color-secondary-500: #2e9995; /* 메인. 인증 배지, 보조 버튼 */
	--color-secondary-600: #237c79;
	--color-secondary-700: #1f6462;
	--color-secondary-800: #1d504f;
	--color-secondary-900: #1b4342;

	/* Accent — Apricot Amber */
	--color-accent-100: #fef1dc;
	--color-accent-300: #ffd08a;
	--color-accent-400: #ffb65c;
	--color-accent-500: #f79e3d; /* 뱃지, 별점, 프로모션 */
	--color-accent-600: #dd7f1f;

	/* Status */
	--color-success-100: #e6f6ee;
	--color-success-500: #1fa060;
	--color-success-700: #157347;
	--color-warning-100: #fdf3e1;
	--color-warning-500: #e8930c;
	--color-warning-700: #b26e05;
	--color-error-100: #fdecec;
	--color-error-500: #e0433d; /* primary 코랄보다 명확히 '빨강' */
	--color-error-700: #b32a25;

	/* Neutral — Cool Gray (zinc) */
	--color-neutral-0: #ffffff;
	--color-neutral-50: #fafafa;
	--color-neutral-100: #f4f4f5;
	--color-neutral-200: #e4e4e7;
	--color-neutral-300: #d4d4d8;
	--color-neutral-400: #a1a1aa;
	--color-neutral-500: #71717a;
	--color-neutral-600: #52525b;
	--color-neutral-700: #3f3f46;
	--color-neutral-800: #27272a;
	--color-neutral-900: #18181b;
}
```

### 시맨틱 토큰 & 다크 모드

라이트/다크는 시맨틱 변수(`--color-bg` 등)를 `:root` / `.dark`(또는 `prefers-color-scheme`)에서 스왑하는 방식을 권장. `@theme`의 원시 스케일은 고정하고, 컴포넌트는 시맨틱 토큰만 참조한다.

| 시맨틱 토큰            | 라이트                    | 다크                      | 용도                        |
| ---------------------- | ------------------------- | ------------------------- | --------------------------- |
| `--color-bg`           | `#fafafa` (neutral-50)    | `#18181b` (neutral-900)   | 페이지 배경                 |
| `--color-surface`      | `#ffffff` (neutral-0)     | `#27272a` (neutral-800)   | 카드, 시트, 모달            |
| `--color-surface-alt`  | `#f4f4f5` (neutral-100)   | `#313136`                 | 입력창, 비활성 영역         |
| `--color-border`       | `#e4e4e7` (neutral-200)   | `#3f3f46` (neutral-700)   | 구분선, 카드 테두리         |
| `--color-text`         | `#18181b` (neutral-900)   | `#f4f4f5` (neutral-100)   | 본문                        |
| `--color-text-sub`     | `#71717a` (neutral-500)   | `#a1a1aa` (neutral-400)   | 보조 텍스트, 캡션           |
| `--color-brand`        | `#f26b4a` (primary-500)   | `#fb8666` (primary-400)   | CTA — 다크에선 한 단계 밝게 |
| `--color-brand-subtle` | `#fff5f2` (primary-50)    | `#3a2620`                 | 선택 상태 배경              |
| `--color-trust`        | `#2e9995` (secondary-500) | `#4bb3b0` (secondary-400) | 인증·안전 UI                |

**금지 사항**: 배경에 순검정(#000)·네이비 금지, 보라(#8B00FF 계열)·마젠타 네온 금지, 글로우/네온 이펙트 금지, 붉은 조명 톤의 사진 필터 금지.

---

## ③ 타이포그래피

### 한글 웹폰트 후보 비교

| 후보                  | 특징                                                                                                           | 판단                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Pretendard** (권장) | system-ui 대체 목적으로 설계, 9 웨이트 + variable, Inter 기반이라 숫자·라틴 품질 우수. 국내 서비스 사실상 표준 | **본문·UI 전체에 채택**                                       |
| SUIT                  | Pretendard 대비 폭이 좁고 기하학적. 9 스타일                                                                   | 밀도 높은 표에는 유리하나 따뜻함이 덜함                       |
| Wanted Sans           | 원티드 브랜드 폰트, 기하학적 산세리프, variable 지원                                                           | 헤드라인 전용으로 쓸 수 있으나 굳이 2폰트 체제로 갈 이유 없음 |

**결론: Pretendard Variable 단일 체제.** 요금·시간 등 숫자가 많은 서비스라 tabular numbers(`font-variant-numeric: tabular-nums`)를 요금표·타이머에 적용한다.

```css
@theme {
	--font-sans:
		"Pretendard Variable", Pretendard, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR",
		sans-serif;
}
```

CDN: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css` (dynamic subset 권장 — 한글 전체 로드 방지).

### 사이즈 스케일 (Tailwind v4 토큰)

모바일 우선. 한글은 라틴보다 시각 밀도가 높아 line-height를 넉넉히(1.5~1.6) 잡는다.

| 토큰          | 크기/행간   | 웨이트  | 용도                           |
| ------------- | ----------- | ------- | ------------------------------ |
| `--text-xs`   | 12px / 1.5  | 400–500 | 캡션, 법적 고지, 타임스탬프    |
| `--text-sm`   | 14px / 1.5  | 400–500 | 보조 텍스트, 태그, 리스트 메타 |
| `--text-base` | 16px / 1.6  | 400     | 본문, 채팅 말풍선              |
| `--text-lg`   | 18px / 1.55 | 500–600 | 카드 제목, 파트너 이름         |
| `--text-xl`   | 20px / 1.5  | 600     | 섹션 제목                      |
| `--text-2xl`  | 24px / 1.4  | 700     | 페이지 제목, 요금 강조         |
| `--text-3xl`  | 30px / 1.3  | 700     | 홈 히어로, 온보딩              |

웨이트 규칙: 400(본문) / 500(강조 본문·레이블) / 600(제목) / 700(페이지 타이틀·금액). 300 이하는 한글 가독성이 나빠 사용 금지.

---

## ④ 화면별 레이아웃 가이드 (핵심 5개)

### 1. 홈 — 파트너 탐색

**참고**: 에어비앤비 리스팅 그리드 + 캐치테이블 상단 필터. (Tinder식 풀스크린 스와이프는 배제 — "외모 평가" 프레임이 성인 서비스 연상 리스크를 키움.)

- 상단: 검색바(지역·날짜) + 가로 스크롤 필터 칩(지역, 가능 요일, 요금대, 관심사).
- 본문: **2열 카드 그리드(모바일) / 4열(데스크톱)**. 카드 구성 = 세로형 사진(3:4) → 이름·나이 → 인증 배지(teal) → 관심사 태그 2–3개 → **시간당 요금**("₩30,000 / 시간" — 렌탈카노조 관행처럼 시간 단위 요금을 카드에서 즉시 노출) → 별점·후기 수.
- 렌탈카노조 사이트들의 등급 라벨(신인/레귤러/프리미엄) 패턴 참고 — "NEW" 뱃지(accent)만 차용하고 등급제 노출은 지양.
- 하단 탭바: 탐색 / 예약 / 채팅 / 마이페이지.
- 안전 요소: 첫 진입 시 성인인증 게이트(전체 화면, 통과 전 프로필 노출 금지), 헤더에 안전 정책 링크.

### 2. 파트너 상세

**참고**: 에어비앤비 숙소 상세(사진 캐러셀 + 정보 섹션 + 하단 고정 예약 바) + Bumble 프로필의 세로 스크롤 정보 배치.

- 최상단: 사진 캐러셀(3:4, 도트 인디케이터). 우상단에 **신고·차단 메뉴(⋯)** — 법적 요건이므로 상세 화면 1뎁스에 항상 노출.
- 이름·나이 + 실명·성인인증 배지(teal) + 응답률/응답 시간(신뢰 지표).
- 자기소개 → 관심사 태그 → **요금표**(기본 시간당 요금, 최소 이용 시간, 연장 단가 — 렌카노처럼 "2시간 ₩60,000 / 30분 연장 ₩15,000" 표 형태, tabular-nums 적용) → 가능 시간 캘린더 미리보기 → 데이트 코스 제안(공개 장소 아이콘: 카페·전시·산책) → 후기 리스트.
- 하단 고정 바: 좌측 요금 요약, 우측 primary CTA "예약하기" + 보조 "채팅 문의"(secondary).

### 3. 예약 플로우

**참고**: 캐치테이블(날짜·시간·인원 단일 화면 선택) + 에어비앤비 캘린더(가능일은 진하게, 불가일은 흐린 해칭 — GoodUI 실험에서 검증된 패턴) + 숨고식 단계 분리.

- 4단계 스텝퍼: **① 날짜·시간 → ② 코스·장소 → ③ 확인 → ④ 결제**. 상단에 진행 인디케이터.
- ① 월 캘린더(가능일만 활성, primary-50 배경으로 표시) → 시간 슬롯 칩 그리드(30분 단위) → 이용 시간 스테퍼(최소 2시간). 선택 즉시 하단에 요금 합계 실시간 갱신.
- ② 만남 장소 검색(공개 장소만 — 카페/식당/문화시설 카테고리 화이트리스트) + 코스 템플릿 선택.
- ③ 요약 카드(파트너·일시·장소·요금 내역) + **안전 수칙·금지 행위 고지(체크박스 동의)** — 법적 제약 3번을 예약 확정 전에 명시.
- ④ 에스크로 안내("데이트 완료 후 파트너에게 정산됩니다") + 결제. 취소 정책을 결제 버튼 위에 요약 표시.

### 4. 채팅

**참고**: 카카오톡 관성(국내 사용자 기준) + 데이팅 앱의 안전 장치 패턴.

- 리스트: 아바타 + 이름 + 마지막 메시지 + 예약 상태 뱃지("예약 확정 D-2" 등 — 채팅과 예약 컨텍스트 연결).
- 대화방: 상단 바에 예약 요약 카드(일시·장소, 탭하면 예약 상세) 고정. 우상단 ⋯ 메뉴에 **신고·차단** 상시 노출.
- 말풍선: 상대 = surface 흰색, 나 = primary-500. 시스템 메시지(예약 확정·정산 완료)는 중앙 정렬 캡션.
- 안전 장치 UI: 첫 대화방 진입 시 "대화는 저장되며 삭제할 수 없습니다 · 조건만남 유도는 제재됩니다" 고지 배너(warning-100 배경). 금칙어 감지 시 인라인 경고. 입력창 옆 긴급 신고 버튼.
- Supabase Realtime 기반 — 읽음 표시·타이핑 인디케이터는 v1에서 생략 가능.

### 5. 마이페이지

**참고**: 에어비앤비 프로필 탭(리스트형 메뉴) + 토스식 카드 그룹핑.

- 상단: 프로필 카드(사진·닉네임·인증 상태). **인증 상태(성인인증·실명·휴대전화)를 teal 배지 3종으로 시각화** — 미완료 항목은 warning 색으로 완료 유도.
- 예약 섹션: 다가오는 예약 카드(일시·파트너·장소, 탭하면 상세) → 지난 예약 리스트(후기 작성 CTA 노출).
- 리스트형 메뉴 그룹: 결제 수단 / 후기 관리 / 차단 목록 / 안전 센터(신고 내역·긴급 연락) / 고객센터 / 약관·정책.
- 파트너 역할 사용자는 상단 토글로 파트너 대시보드 전환(프로필 관리·가능 시간·정산 내역).
- 로그아웃·탈퇴는 최하단, text-sub 컬러로 소극적 배치.

---

## ⑤ 참고 레퍼런스 링크

**렌탈카노조 (일본 실서비스 UI)**

- [코이카노 도쿄](https://www.koikano-tokyo.jp/) — 흰 배경 + 연핑크의 밝은 톤, 프로필 카드(사진·이름·나이·태그·등급), "120분 12,000엔~" 요금 표기, LINE 상담 유도
- [렌카노 도쿄 요금 페이지](https://tokyo.rent-kano.net/price.html) — 시간 단위 요금표(2h/3h/4h + 30분 연장 단가), 옵션(OP) 태그, 지명료·취소료 체계
- [나츠카노 도쿄](https://natukano.jp/) — LINE 기반 예약 플로우(캐스트·일시·장소·플랜 전달 → 운영이 확정)

**데이팅 앱 UI**

- [Tinder vs Bumble UI/UX 비교 (Medium)](https://medium.com/design-bootcamp/decoding-ui-ux-quick-comparison-of-tinder-and-bumble-9a3cb2b76f28)
- [Bumble vs CMB vs Tinder UX 오딧 (Snappymob)](https://blog.snappymob.com/uiux-audit-bumble-vs-cmb-vs-tinder)
- [데이팅 앱 UI/UX 10계명 (Icons8)](https://icons8.com/blog/articles/10-dos-and-donts-of-ui-ux-design-for-dating-apps/)
- [글램 앱 개요 (나무위키)](<https://namu.wiki/w/%EA%B8%80%EB%9E%A8(%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98)>) — AI 프로필 사진 검수·인증 시스템 참고

**예약 플랫폼 UX**

- [Airbnb 캘린더 피커 실험 (GoodUI)](https://goodui.org/leaks/airbnb-discovers-a-better-calendar-picker-component-from-this-ui-experiment/) — 가능일/불가일 대비 강화 패턴
- [Airbnb 폼 디자인 패턴 (Medium)](https://medium.com/@erikyoung_58444/airbnb-form-design-patterns-and-user-flow-10e374cb350a)
- [캐치테이블 vs 테이블링 예약 UX 비교 (Brunch)](https://brunch.co.kr/@4e2b4f97d7214af/60)
- [캐치테이블 식당 예약 프로세스 분석](https://weeklyuxuichallenge.oopy.io/eed24a76-0296-4896-9962-7dcf46ecfad4)
- [날짜·시간 선택 UI 패턴 (Brunch)](https://brunch.co.kr/@hi-hazel/4)
- [Date Picker 베스트 프랙티스 (Mobbin)](https://mobbin.com/glossary/date-picker)

**컬러 & 타이포**

- [헬스케어 컬러 심리학 2025 (Naskay)](https://naskay.com/blog/color-psychology-in-healthcare-ui-2025/) — 코랄·피치의 "부담 없는 따뜻함", teal의 신뢰
- [브랜딩 컬러 심리학 (ColorUXLab)](https://coloruxlab.com/guides/color-psychology)
- [Pretendard (GitHub)](https://github.com/orioncactus/pretendard)
- [Wanted Sans](https://www.freekoreanfont.com/wanted-sans-free-download/)
- [눈누 — 한글 폰트 모음](https://noonnu.cc/en)
