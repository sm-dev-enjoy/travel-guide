<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# TripFinder (트립파인더) - AI 에이전트 작업 가이드 (AGENTS.md)

이 문서는 AI 에이전트가 본 프로젝트(**트립파인더 - AI 맞춤 여행지 추천 웹서비스**)를 분석, 수정, 확장할 때 반드시 준수해야 하는 공통 작업 원칙과 가이드라인입니다.

---

## 1. 프로젝트 목적 (Project Purpose)
* **서비스명**: 트립파인더 (TripFinder)
* **목적**: 사용자가 **여행 스타일, 기간, 예산, 동행자** 등 간단한 조건을 선택하면, 최적의 여행지를 분석하여 추천 결과(일치도 점수, 맞춤 추천 사유, 예상 경비, 일자별 상세 코스, 현지 맛집 꿀팁)를 직관적이고 감각적인 UI로 제공하는 웹서비스입니다.
* **현재 상태**: 프론트엔드 로컬 Mock Data 및 스마트 스코어링 알고리즘 기반으로 동작 중이며, 향후 **Gemini API** 및 외부 여행 데이터 연동이 가능하도록 모듈화되어 있습니다.

---

## 2. 기술 스택 (Tech Stack)
* **Framework**: Next.js 16+ (App Router)
* **Library**: React 19, TypeScript
* **Styling**: Tailwind CSS v4, Lucide React (아이콘), Canvas Confetti (인터랙션 효과)
* **Package Manager**: npm
* **배포 & CI/CD**: Vercel (GitHub 연동 자동 배포), GitHub Actions (`.github/workflows/ci.yml`)

---

## 3. 디렉토리 구조 및 파일/컴포넌트 작성 원칙

### 디렉토리 구조
```text
src/
├── app/                  # Next.js App Router (layout.tsx, page.tsx, globals.css)
├── components/           # UI 및 도메인 기능 컴포넌트
│   ├── Header.tsx        # 상단 네비게이션 및 로고
│   ├── HeroSection.tsx   # 메인 소개 화면 및 추천 시작 CTA
│   ├── TravelSurvey.tsx  # 4단계 여행 조건 입력 마법사
│   ├── LoadingAnalysis.tsx # AI 분석 로딩 시뮬레이션
│   ├── DestinationCard.tsx # 여행지 추천 카드
│   ├── RecommendationResults.tsx # 추천 결과 화면
│   ├── DestinationDetailModal.tsx # 여행지 상세 일정/맛집 모달
│   └── Footer.tsx        # 하단 푸터
├── data/                 # Mock Data 정의 (destinations.ts)
├── types/                # TypeScript 타입 및 인터페이스 (travel.ts)
└── utils/                # 추천 알고리즘 및 유틸리티 (recommendationEngine.ts)
```

### 컴포넌트 작성 원칙
1. **단일 책임 원칙 (SRP)**:
   * 하나의 컴포넌트는 하나의 명확한 역할만 담당하도록 분리합니다.
   * 비즈니스/스코어링 로직은 `src/utils/`에, 데이터 정의는 `src/data/`에, 인터페이스는 `src/types/`에 작성합니다.
2. **Client Component 선언**:
   * `useState`, `useEffect`, 이벤트 핸들러(`onClick`)를 사용하는 컴포넌트 상단에는 반드시 `'use client';`를 명시합니다.
3. **타입 안전성 (Strict Typing)**:
   * `any` 타입 사용을 금지하며, `src/types/travel.ts`에 정의된 타입을 엄격히 재사용합니다.
   * 새로운 데이터 속성이 필요할 경우 반드시 타입 정의를 먼저 업데이트합니다.
4. **경로 별칭 (Path Alias)**:
   * 내부 모듈 import 시 상대 경로(`../../`) 대신 `@/` 별칭(예: `@/types/travel`, `@/components/Header`)을 사용합니다.

---

## 4. 기존 코드 재사용 및 기능 보존 원칙 (Do Not Break Existing Code)
1. **임의 삭제 및 파괴적 변경 금지**:
   * 새로운 기능이나 디자인을 추가할 때 기존에 구현된 기능(스텝별 설문, 점수 계산, 모달 팝업, 조건 수정, 다시 추천, 공유하기 등)을 임의로 삭제하거나 동작을 깨뜨리지 마세요.
2. **하위 호환성 유지**:
   * `Destination`이나 `TravelSurveyInput` 타입의 필수 필드를 임의로 삭제하지 말고, 필요 시 Optional(`?`) 필드로 확장합니다.
3. **기존 컴포넌트 재활용**:
   * 새 화면이나 기능을 만들 때 기존에 작성된 `DestinationCard`, `DestinationDetailModal` 등의 컴포넌트를 우선적으로 재사용합니다.

---

## 5. UI/UX 디자인 기준
* **디자인 톤앤매너**:
  * 신뢰감과 청량감을 주는 블루/스카이 계열 포인트 컬러 (`sky-500`, `indigo-600`, `slate-900`)
  * 모던하고 세련된 카드 형태의 UI (`rounded-2xl`, `rounded-3xl`, 부드러운 shadow 적용)
* **피드백 및 마이크로 인터랙션**:
  * 버튼 클릭 시 호버/액티브 애니메이션 (`hover:-translate-y-0.5`, `active:translate-y-0`, `transition-all`)
  * 로딩 상태, 결과 화면 전환 시 매끄러운 페이드인 (`animate-fade-in`)
* **일관된 아이콘 사용**:
  * 모든 아이콘은 `lucide-react`를 사용하여 일관된 크기(`w-4 h-4`, `w-5 h-5`)와 굵기로 배치합니다.

---

## 6. 모바일 반응형 원칙 (Mobile Responsive)
* **모바일 우선(Mobile First) 고려**:
  * 모든 화면은 모바일 화면(360px~), 태블릿(768px~), 데스크탑(1024px~)에서 자연스럽게 반응해야 합니다.
* **반응형 그리드 및 레이아웃**:
  * 카드 그리드는 모바일 1열 → 데스크탑 3열 (`grid-cols-1 md:grid-cols-3 gap-6`) 형태로 구성합니다.
  * 모달과 팝업은 모바일 화면에서 잘리지 않도록 `max-h-[90vh] overflow-y-auto`와 적절한 패딩(`p-4 sm:p-6`)을 필수 적용합니다.
* **터치 친화적인 UI**:
  * 모바일 터치 편의를 위해 모든 선택 칩과 버튼의 최소 높이를 충분히 확보합니다 (`min-h-[44px]`).

---

## 7. API Key 및 환경변수 관리 원칙
1. **비밀 키 하드코딩 금지**:
   * 향후 Gemini API Key, 외부 서비스 토큰 등을 코드에 직접 하드코딩하지 않습니다.
2. **환경변수 파일 규칙**:
   * 로컬 개발 환경변수는 `.env.local`에 저장하며, `.env.local`은 `.gitignore`에 포함되어 있어야 합니다.
   * 환경변수 템플릿은 `.env.example`로 문서화합니다.
3. **클라이언트/서버 환경변수 구분**:
   * 서버 사이드 전용 키: `GEMINI_API_KEY` (Next.js Server Actions / API Route 내부에서만 접근)
   * 브라우저 노출 키: `NEXT_PUBLIC_` 접두사 사용 (보안에 민감한 비밀키는 절대 `NEXT_PUBLIC_`으로 선언하지 않음)

---

## 8. 작업 후 검증 및 빌드 확인 (Verification)
코드 수정이나 기능 추가를 완료한 후에는 반드시 다음 단계를 순서대로 실행하여 검증합니다.

```bash
# 1. 린트 검사
npm run lint

# 2. TypeScript 컴파일 및 프로덕션 빌드 검증 (반드시 0 errors 확인)
npm run build

# 3. 로컬 개발 서버 실행 및 브라우저 테스트
npm run dev
```

* 빌드 또는 린트 오류 발생 시, 원인을 파악하여 즉시 수정한 후 작업을 마무리합니다.
