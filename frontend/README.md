# GMTrip Frontend

한 번의 여행이 지나가버리는 기억이 아닌 나만의 이야기가 되는 공간

## 🚀 마이그레이션 완료

이 프로젝트는 **React + Vite**에서 **Next.js + TypeScript**로 성공적으로 마이그레이션되었습니다.

## 📋 주요 변경사항

### 기술 스택 변경
- **React + Vite** → **Next.js 15 + TypeScript**
- **React Router** → **Next.js App Router**
- **JavaScript** → **TypeScript**
- **CSS Modules** → **Tailwind CSS + CSS**

### 프로젝트 구조
```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 랜딩 페이지 (/)
│   ├── login/page.tsx     # 로그인 페이지 (/login)
│   ├── main/page.tsx      # 메인 페이지 (/main)
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 가능한 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   └── Landing/          # 랜딩 페이지 컴포넌트
├── hooks/                # 커스텀 훅
├── stores/               # 상태 관리 (Zustand)
├── types/                # TypeScript 타입 정의
├── api/                  # API 관련 파일
└── assets/               # 정적 에셋
```

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치
```bash
npm install
```

### 환경 변수 설정
`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_js_key_here
NEXT_PUBLIC_API_BASE_URL=your_api_base_url_here
```

#### 카카오 로그인 설정 방법
1. [카카오 개발자 콘솔](https://developers.kakao.com/)에 접속
2. 애플리케이션 생성 후 JavaScript 키 복사
3. `.env.local` 파일에 `NEXT_PUBLIC_KAKAO_JS_KEY` 설정
4. 플랫폼 설정에서 웹 도메인 추가 (예: `http://localhost:3000`)

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드
```bash
npm run build
```

### 프로덕션 서버 실행
```bash
npm start
```

## 📦 주요 의존성

- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Zustand** - 상태 관리
- **Axios** - HTTP 클라이언트
- **React Icons** - 아이콘 라이브러리
- **D3** - 데이터 시각화
- **React DatePicker** - 날짜 선택기

## 🔧 개발 도구

- **ESLint** - 코드 품질 검사
- **TypeScript** - 정적 타입 검사
- **Prettier** - 코드 포맷팅

## 📱 주요 기능

- 🏠 **랜딩 페이지** - 서비스 소개 및 메뉴
- 🔐 **카카오 로그인** - 소셜 로그인
- 🏖️ **여행 관리** - 현재/과거 여행 보기
- 📸 **미션 시스템** - 여행 미션 및 사진 업로드
- 🗺️ **지도 기능** - 강원도 관광지 지도
- 📱 **반응형 디자인** - 모바일 최적화

## 🚀 배포

이 프로젝트는 Vercel, Netlify 등 Next.js를 지원하는 플랫폼에 배포할 수 있습니다.

### Vercel 배포
```bash
npm install -g vercel
vercel
```

## 📝 마이그레이션 노트

### 변경된 API
- `import.meta.env` → `process.env.NEXT_PUBLIC_`
- `useNavigate` → `useRouter` (Next.js)
- `Routes/Route` → App Router 파일 기반 라우팅

### 타입 안전성
- 모든 컴포넌트와 훅이 TypeScript로 변환됨
- 엄격한 타입 검사 활성화
- 인터페이스 기반 타입 정의

### 성능 최적화
- Next.js Image 컴포넌트 사용
- 자동 코드 분할
- 정적 생성 지원

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.