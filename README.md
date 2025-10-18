# AR Drawing Helper

카메라를 활용한 그림 그리기 도우미 PWA 웹앱입니다.

## 주요 기능

### 단계별 사용 흐름
1. **카메라 권한 요청** - 앱 실행 시 명시적으로 카메라 권한 요청
2. **그림 그리기 시작** - 권한 획득 후 "그림 그리기 시작" 버튼으로 카메라 활성화
3. **이미지 선택** - 중앙의 투명한 버튼을 눌러 따라 그릴 이미지 선택
4. **이미지 조정** - 선택한 이미지를 카메라 화면에 반투명 오버레이
   - 크기 조절 (0.1x ~ 3.0x)
   - 회전 (0° ~ 360°)
   - 투명도 (0% ~ 100%)
   - 드래그로 위치 이동
5. **설정 저장** - 이미지 터치 시 설정 패널 열림, 자동 저장

### 핵심 기능
- 단계별 카메라 권한 관리 (루핑 방지)
- 투명한 이미지 선택 버튼
- 실시간 이미지 오버레이 with 조정 기능
- LocalStorage 자동 저장 및 복원
- PWA 지원 (오프라인 사용 가능, 홈 화면 추가)
- 귀여운 강아지 + 펜 아이콘

## 기술 스택

- **React 18** - UI 컴포넌트 프레임워크
- **TypeScript** - 타입 안정성
- **Vite** - 빠른 개발 환경 및 빌드
- **vite-plugin-pwa** - PWA 지원 (Service Worker)
- **MediaDevices API** - 카메라 접근
- **LocalStorage API** - 설정 저장

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 프로덕션 빌드

```bash
npm run build
```

### 4. 빌드 미리보기

```bash
npm run preview
```

## Netlify 배포

### Git 연동 배포 (권장)

1. GitHub 저장소에 코드 푸시
2. Netlify 대시보드에서 "New site from Git" 클릭
3. 저장소 연결
4. Build settings 확인:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy site 클릭

### CLI 배포

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 사이트 생성
netlify sites:create

# 배포
netlify deploy --prod
```

## 사용 방법

1. 앱 실행 시 **"카메라 권한 요청"** 버튼 클릭
2. 브라우저에서 카메라 권한 허용
3. **"그림 그리기 시작"** 버튼 클릭하여 카메라 활성화
4. 화면 중앙의 **투명한 "+ 이미지 선택"** 버튼 클릭
5. 따라 그릴 이미지 파일 선택
6. 하단 컨트롤로 이미지 조정:
   - **크기**: 슬라이더로 확대/축소
   - **회전**: 슬라이더로 각도 조정
   - **투명도**: 슬라이더로 투명도 조정
   - **위치**: 이미지를 드래그하여 이동
7. 이미지를 터치하면 설정 패널 다시 열기
8. **완료** 버튼으로 설정 저장 (자동 저장됨)
9. **초기화** 버튼으로 기본값으로 복원

## 프로젝트 구조

```
ar-drawing/
├── public/
│   ├── icon.svg                 # PWA 아이콘 (강아지+펜)
│   ├── icons/
│   │   ├── icon-192.svg
│   │   └── icon-512.svg
│   └── manifest.json            # PWA 매니페스트
├── src/
│   ├── App.tsx                  # 메인 앱 (AppStep 상태 관리)
│   ├── App.css                  # 앱 스타일
│   ├── components/
│   │   ├── Camera.tsx           # 카메라 스트림 표시
│   │   ├── ImageOverlay.tsx     # 이미지 오버레이 + 드래그
│   │   ├── Controls.tsx         # 이미지 조정 컨트롤
│   │   └── TransparentImageButton.tsx  # 투명 이미지 선택 버튼
│   ├── hooks/
│   │   ├── useCamera.ts         # 카메라 권한/스트림 관리
│   │   └── useImageSettings.ts  # 이미지 설정 + LocalStorage
│   └── types/
│       └── index.ts             # TypeScript 타입 정의
├── package.json
├── vite.config.ts               # Vite + PWA 설정
├── netlify.toml                 # Netlify 배포 설정
├── CLAUDE.md                    # 개발자 문서
└── README.md                    # 사용자 가이드
```

## 브라우저 지원

- Chrome/Edge (데스크톱 및 모바일)
- Safari (iOS 및 macOS)
- Firefox

**중요**: 카메라 접근은 **HTTPS** 환경에서만 가능합니다.
Netlify는 자동으로 HTTPS를 제공하며, 로컬 개발 시에는 `localhost`에서 허용됩니다.

## 주요 특징

### 단계별 권한 관리
앱은 5단계 상태(AppStep)로 관리됩니다:
- `initial` - 초기 화면 (카메라 권한 요청 버튼)
- `permission` - 권한 요청 중
- `ready` - 권한 획득 완료 (시작 버튼)
- `camera_active` - 카메라 활성화 (이미지 선택 버튼)
- `image_selected` - 이미지 선택 완료 (오버레이 + 컨트롤)

### 설정 자동 저장
모든 설정은 LocalStorage에 자동 저장되며, 다음 실행 시 복원됩니다:
- 선택한 이미지 (Base64)
- 크기, 회전, 투명도 값
- 이미지 위치

### PWA 기능
- 홈 화면에 추가 가능
- 오프라인에서도 실행 가능
- Standalone 모드 지원
- 자동 업데이트 (Service Worker)

## 트러블슈팅

### 카메라 접근 안됨
- HTTPS 환경인지 확인 (Netlify 배포 권장)
- 브라우저 권한 설정 확인
- 에러 메시지의 "다시 시도" 버튼 클릭

### 이미지 선택 후 표시 안됨
- 이미지 파일 크기 확인 (너무 큰 이미지는 LocalStorage 제한)
- 브라우저 콘솔에서 에러 확인

### 설정이 저장 안됨
- 프라이빗 모드가 아닌지 확인
- LocalStorage 용량 확인 (일반적으로 5-10MB)

## 저작권 및 라이선스

- **저작권**: © HanTJ. All rights reserved.
- **라이선스**: MIT License
- **의견 및 후원**: [https://taisou.tistory.com](https://taisou.tistory.com)

## 개발 문서

더 자세한 기술 문서는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

## 버전

**v1.0.0** (2025-10-18)
- 초기 릴리스
- 단계별 카메라 권한 관리
- 이미지 오버레이 + 조정 기능
- LocalStorage 설정 저장
- PWA 지원
