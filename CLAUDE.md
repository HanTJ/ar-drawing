# AR Drawing - PWA 기반 AR 웹앱

## 프로젝트 개요
Progressive Web App(PWA) 기술을 활용한 증강현실(AR) 드로잉 애플리케이션입니다.
사용자가 선택한 사진을 카메라 화면에 반투명하게 오버레이하여 따라 그릴 수 있는 기능을 제공합니다.

## 기술 스택

### 핵심 기술
- **TypeScript**: 타입 안정성을 위한 정적 타입 언어
- **React**: UI 컴포넌트 기반 프레임워크
- **Vite**: 빠른 개발 환경 및 빌드 도구
- **Three.js / @react-three/fiber**: 3D 그래픽 렌더링
- **PWA**: 오프라인 지원 및 네이티브 앱 경험
- **Service Worker**: 캐싱 및 오프라인 기능

### 지원 환경
- Chrome/Edge (Android)
- Safari (iOS 15+, WebXR Viewer 필요)
- AR Core 지원 Android 기기
- AR Kit 지원 iOS 기기

## 주요 기능

### 1. 사진 선택 및 카메라 오버레이
- 사용자가 따라 그릴 사진 선택
- 선택한 사진이 카메라 화면 위에 반투명하게 표시
- 실시간 카메라 피드와 사진 오버레이 합성

### 2. 이미지 조정 기능
- **크기 조절**: 핀치/슬라이더를 통한 확대/축소
- **회전**: 사진을 회전시켜 원하는 각도로 조정
- **투명도 조절**: 0~100% 범위에서 투명도 설정
- **위치 조정**: 드래그로 사진 위치 이동

### 3. 설정 저장
- LocalStorage를 통한 사용자 설정 저장
  - 마지막으로 선택한 사진
  - 크기, 회전, 투명도 값
  - 위치 정보
- 앱 재실행 시 이전 설정 자동 복원

### 4. PWA 기능
- 홈 화면 설치 가능
- 오프라인 동작
- 빠른 로딩 및 캐싱

## 프로젝트 구조

```
ar-drawing/
├── public/
│   ├── manifest.json           # PWA 매니페스트
│   ├── sw.js                   # Service Worker
│   └── icons/                  # PWA 아이콘
├── src/
│   ├── App.tsx                 # 메인 앱 컴포넌트
│   ├── main.tsx                # 엔트리 포인트
│   ├── components/
│   │   ├── Camera.tsx          # 카메라 컴포넌트
│   │   ├── ImageOverlay.tsx    # 이미지 오버레이
│   │   ├── Controls.tsx        # 조정 컨트롤
│   │   └── ImagePicker.tsx     # 사진 선택기
│   ├── hooks/
│   │   ├── useCamera.ts        # 카메라 훅
│   │   ├── useImageSettings.ts # 이미지 설정 훅
│   │   └── useLocalStorage.ts  # 로컬 스토리지 훅
│   ├── types/
│   │   └── index.ts            # TypeScript 타입 정의
│   ├── utils/
│   │   └── storage.ts          # 저장소 유틸리티
│   └── styles/
│       └── global.css          # 글로벌 스타일
├── package.json
├── tsconfig.json
├── vite.config.ts
└── netlify.toml                # Netlify 배포 설정
```

## 시작하기

### 1. 프로젝트 초기화
```bash
# Vite + React + TypeScript 프로젝트 생성
npm create vite@latest ar-drawing -- --template react-ts
cd ar-drawing
npm install

# 추가 의존성 설치
npm install @react-three/fiber three
npm install -D @types/three
```

### 2. TypeScript 타입 정의
```typescript
// src/types/index.ts
export interface ImageSettings {
  scale: number;        // 크기 (0.1 ~ 3.0)
  rotation: number;     // 회전 각도 (0 ~ 360)
  opacity: number;      // 투명도 (0 ~ 100)
  position: {
    x: number;
    y: number;
  };
}

export interface StoredSettings extends ImageSettings {
  imageUrl?: string;    // 마지막 선택 이미지
  timestamp: number;
}
```

### 3. 카메라 및 오버레이 컴포넌트
```typescript
// src/components/Camera.tsx
import { useRef, useEffect } from 'react';

interface CameraProps {
  onStreamReady: (stream: MediaStream) => void;
}

export const Camera: React.FC<CameraProps> = ({ onStreamReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        onStreamReady(stream);
      }
    })
    .catch(err => console.error('카메라 접근 실패:', err));
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};
```

### 4. PWA Manifest 설정
```json
{
  "name": "AR Drawing",
  "short_name": "AR Draw",
  "description": "증강현실 드로잉 앱",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196F3",
  "icons": [
    {
      "src": "/assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 3. Service Worker 기본 구조
```javascript
const CACHE_NAME = 'ar-drawing-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/lib/three.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### 5. LocalStorage 관리 훅
```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';
import { ImageSettings, StoredSettings } from '../types';

const STORAGE_KEY = 'ar-drawing-settings';

export const useLocalStorage = () => {
  const [settings, setSettings] = useState<ImageSettings>({
    scale: 1,
    rotation: 0,
    opacity: 50,
    position: { x: 0, y: 0 }
  });

  // 저장된 설정 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: StoredSettings = JSON.parse(stored);
      setSettings({
        scale: data.scale,
        rotation: data.rotation,
        opacity: data.opacity,
        position: data.position
      });
    }
  }, []);

  // 설정 저장
  const saveSettings = (newSettings: Partial<ImageSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    const toStore: StoredSettings = {
      ...updated,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  };

  return { settings, saveSettings };
};
```

### 6. Netlify 배포 설정
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Permissions-Policy = "camera=(self)"
```

## 개발 가이드

### 컴포넌트 구조
1. **App.tsx**: 전체 앱 상태 관리
2. **ImagePicker**: 사진 선택 UI
3. **Camera**: 카메라 스트림 처리
4. **ImageOverlay**: 선택한 이미지를 카메라 위에 오버레이
5. **Controls**: 크기, 회전, 투명도 조절 UI

### 이미지 오버레이 구현
```typescript
// src/components/ImageOverlay.tsx
interface ImageOverlayProps {
  imageUrl: string;
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({
  imageUrl,
  settings,
  onSettingsChange
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `
          translate(-50%, -50%)
          translate(${settings.position.x}px, ${settings.position.y}px)
          scale(${settings.scale})
          rotate(${settings.rotation}deg)
        `,
        opacity: settings.opacity / 100,
        pointerEvents: 'none'
      }}
    >
      <img src={imageUrl} alt="Overlay" />
    </div>
  );
};
```

### LocalStorage 데이터 구조
```typescript
{
  "scale": 1.0,              // 크기 (0.1 ~ 3.0)
  "rotation": 0,             // 회전 (0 ~ 360)
  "opacity": 50,             // 투명도 (0 ~ 100)
  "position": {
    "x": 0,
    "y": 0
  },
  "imageUrl": "blob:...",    // 선택한 이미지 URL
  "timestamp": 1234567890    // 저장 시간
}
```

### 카메라 권한 처리
```typescript
// 카메라 권한 요청
const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    return stream;
  } catch (error) {
    console.error('카메라 접근 거부:', error);
    // 사용자에게 권한 필요 안내
    alert('카메라 권한이 필요합니다.');
  }
};
```

## 배포

### Netlify 배포 방법

#### 1. Git 연동 배포 (권장)
```bash
# Git 저장소 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub에 푸시
git remote add origin <your-repo-url>
git push -u origin main
```

Netlify 대시보드에서:
1. "New site from Git" 클릭
2. GitHub 저장소 연결
3. Build settings 확인:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy site 클릭

#### 2. CLI 배포
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod
```

#### 3. 환경 변수 설정
Netlify 대시보드 > Site settings > Environment variables에서:
- `NODE_VERSION`: 18

### HTTPS 및 카메라 권한
- Netlify는 자동으로 HTTPS 제공
- 카메라 API는 HTTPS 환경 필수
- 로컬 테스트: `localhost` 허용

### 커스텀 도메인 설정
```bash
# Netlify CLI로 도메인 추가
netlify domains:add your-domain.com
```

## 개발 및 테스트

### 로컬 개발 서버
```bash
# 개발 서버 실행 (Vite)
npm run dev

# 브라우저에서 접속
# http://localhost:5173
```

### 빌드 및 미리보기
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 실제 기기 테스트
1. Netlify에 배포
2. 모바일 기기에서 HTTPS URL 접속
3. 카메라 권한 허용
4. 이미지 선택 및 오버레이 테스트

### 디버깅
```bash
# TypeScript 타입 체크
npx tsc --noEmit

# Vite 빌드 상세 로그
npm run build -- --debug
```

## 주요 기능 구현 체크리스트

- [ ] 사진 선택 기능 (파일 업로드)
- [ ] 카메라 스트림 접근
- [ ] 이미지 오버레이 렌더링
- [ ] 크기 조절 (슬라이더/핀치)
- [ ] 회전 조절 (슬라이더/제스처)
- [ ] 투명도 조절 (슬라이더)
- [ ] 위치 이동 (드래그)
- [ ] LocalStorage에 설정 저장
- [ ] 앱 재실행 시 설정 복원
- [ ] PWA Manifest 설정
- [ ] Service Worker 구현
- [ ] Netlify 배포 설정

## 참고 자료

### React & TypeScript
- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Vite 공식 문서](https://vitejs.dev/)

### 미디어 API
- [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Camera API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API)

### PWA
- [PWA 가이드](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

### 배포
- [Netlify 문서](https://docs.netlify.com/)
- [Netlify CLI](https://cli.netlify.com/)

## 트러블슈팅

### 카메라 접근 안됨
- HTTPS 환경인지 확인
- 브라우저 권한 설정 확인
- `facingMode: 'environment'` 지원 여부 확인

### 이미지가 표시 안됨
- CORS 정책 확인
- 이미지 URL이 유효한지 확인
- CSS transform 순서 확인

### LocalStorage 저장 안됨
- 브라우저 프라이빗 모드 확인
- 저장 용량 한도 확인
- JSON.stringify 에러 확인

### Netlify 빌드 실패
- `package.json`의 스크립트 확인
- Node 버전 호환성 확인
- 빌드 로그에서 에러 확인

## 라이선스
MIT License

## 기여
Pull Request 환영합니다!
