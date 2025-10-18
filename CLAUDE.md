# AR Drawing Helper - PWA 기반 카메라 그림 그리기 도우미

## 프로젝트 개요
Progressive Web App(PWA) 기술을 활용한 카메라 기반 그림 그리기 도우미 앱입니다.
사용자가 선택한 이미지를 카메라 화면에 반투명하게 오버레이하여 따라 그릴 수 있는 기능을 제공합니다.

## 기술 스택

### 핵심 기술
- **TypeScript**: 타입 안정성을 위한 정적 타입 언어
- **React 18**: UI 컴포넌트 기반 프레임워크
- **Vite 5**: 빠른 개발 환경 및 빌드 도구
- **vite-plugin-pwa**: PWA 지원 (Service Worker, Manifest)
- **MediaDevices API**: 카메라 접근 및 스트림 처리
- **LocalStorage**: 클라이언트 사이드 설정 저장

### 배포 플랫폼
- **Netlify**: HTTPS 자동 제공, 카메라 권한 필수

## 주요 기능

### 1. 단계별 카메라 권한 관리
- **초기 화면**: 카메라 권한 요청 버튼 제공
- **권한 요청**: 사용자 명시적 승인 후 권한 획득
- **준비 완료**: "그림 그리기 시작" 버튼으로 카메라 활성화
- **에러 처리**: 권한 거부 시 재시도 옵션 제공

### 2. 이미지 선택 및 오버레이
- 카메라 활성화 후 중앙에 투명한 이미지 선택 버튼 배치
- 이미지 선택 시 카메라 화면 위에 반투명 오버레이
- 드래그로 이미지 위치 이동
- 터치/클릭과 드래그 구분하여 설정 패널 열기

### 3. 이미지 조정 기능
- **크기 조절**: 0.1x ~ 3.0x 슬라이더
- **회전**: 0° ~ 360° 슬라이더
- **투명도**: 0% ~ 100% 슬라이더
- **위치**: 드래그로 자유롭게 이동
- **완료/초기화**: 설정 저장 및 초기값 복원

### 4. 설정 저장 (LocalStorage)
- 선택한 이미지 URL (Base64)
- 크기, 회전, 투명도, 위치 값
- 앱 재실행 시 자동 복원

### 5. PWA 기능
- 홈 화면 추가 가능
- 오프라인 동작 지원
- 귀여운 강아지 + 펜 아이콘
- Standalone 모드 실행

## 프로젝트 구조

```
ar-drawing/
├── public/
│   ├── icon.svg                 # 메인 PWA 아이콘 (강아지+펜)
│   ├── icons/
│   │   ├── icon-192.svg         # 192x192 아이콘
│   │   └── icon-512.svg         # 512x512 아이콘
│   └── manifest.json            # PWA 매니페스트
├── src/
│   ├── App.tsx                  # 메인 앱 (AppStep 상태 관리)
│   ├── App.css                  # 앱 스타일
│   ├── main.tsx                 # 엔트리 포인트
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
├── tsconfig.json
├── vite.config.ts               # Vite + PWA 설정
├── netlify.toml                 # Netlify 배포 설정
├── CLAUDE.md                    # 프로젝트 문서
└── README.md                    # 사용자 가이드
```

## 앱 흐름 (AppStep)

앱은 5단계 상태로 관리됩니다:

```typescript
type AppStep =
  | 'initial'          // 초기 화면 - 카메라 권한 요청 버튼
  | 'permission'       // 권한 요청 중
  | 'ready'            // 권한 획득 완료 - 시작 버튼
  | 'camera_active'    // 카메라 활성화 - 이미지 선택 버튼
  | 'image_selected';  // 이미지 선택 완료 - 오버레이 + 컨트롤
```

### 단계별 UI

1. **initial**: Welcome 화면
   - 제목: "AR Drawing Helper"
   - 버튼: "카메라 권한 요청"
   - Footer: 저작권 정보 (© HanTJ) + 후원 링크

2. **permission**: 로딩 화면
   - 메시지: "카메라 권한을 확인하는 중..."

3. **ready**: 준비 완료 화면
   - 버튼: "그림 그리기 시작"

4. **camera_active**: 카메라 + 선택 버튼
   - 카메라 스트림 전체 화면
   - 중앙에 투명한 "+ 이미지 선택" 버튼

5. **image_selected**: 카메라 + 오버레이 + 컨트롤
   - 이미지 오버레이 (드래그 가능)
   - 이미지 터치 시 설정 패널 열림
   - 설정 패널: 크기/회전/투명도 슬라이더 + 완료/초기화

## 주요 컴포넌트 설명

### App.tsx
```typescript
const [appStep, setAppStep] = useState<AppStep>('initial');
const [showControls, setShowControls] = useState(false);

const { stream, isActive, error, requestCameraPermission, startCamera } = useCamera();
const { settings, imageUrl, updateSettings, updateImage, resetSettings } = useImageSettings();

// 1. 카메라 권한 요청
const handleRequestPermission = async () => {
  setAppStep('permission');
  const granted = await requestCameraPermission();
  if (granted) setAppStep('ready');
};

// 2. 카메라 시작
const handleStartDrawing = async () => {
  await startCamera();
  setAppStep('camera_active');
};

// 3. 이미지 선택
const handleImageSelect = (url: string) => {
  updateImage(url);
  setAppStep('image_selected');
  setShowControls(true);
};

// 4. 이미지 클릭 (설정 패널 열기)
const handleImageClick = () => {
  setShowControls(true);
};
```

### useCamera.ts
```typescript
// 카메라 권한만 요청 (스트림 즉시 종료)
const requestCameraPermission = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
  stream.getTracks().forEach(track => track.stop());
  return true;
};

// 실제 카메라 스트림 시작
const startCamera = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
  setCameraState({ stream, isActive: true, error: null });
};
```

### useImageSettings.ts
```typescript
const STORAGE_KEY = 'ar-drawing-settings';

// LocalStorage에서 설정 불러오기
useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const data = JSON.parse(stored);
    setSettings(data.settings);
    setImageUrl(data.imageUrl);
  }
}, []);

// 설정 변경 시 자동 저장
const updateSettings = (newSettings: Partial<ImageSettings>) => {
  const updated = { ...settings, ...newSettings };
  setSettings(updated);
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    settings: updated,
    imageUrl
  }));
};
```

### TransparentImageButton.tsx
```typescript
// 카메라 활성화 시 중앙에 표시되는 투명 버튼
export const TransparentImageButton = ({ onImageSelect }) => {
  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onImageSelect(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <button className="transparent-image-button" onClick={handleClick}>
      <div className="plus-icon">+</div>
      <p>이미지 선택</p>
    </button>
  );
};
```

### ImageOverlay.tsx
```typescript
// 드래그와 클릭 구분
const [isDragging, setIsDragging] = useState(false);
const [hasMoved, setHasMoved] = useState(false);

const handleTouchEnd = () => {
  if (!hasMoved && onClick) {
    onClick(); // 움직임 없으면 클릭으로 판단 → 설정 패널 열기
  }
  setIsDragging(false);
  setHasMoved(false);
};

// CSS Transform으로 이미지 조정
<img
  style={{
    transform: `
      translate(${settings.position.x}px, ${settings.position.y}px)
      scale(${settings.scale})
      rotate(${settings.rotation}deg)
    `,
    opacity: settings.opacity / 100
  }}
/>
```

### Controls.tsx
```typescript
// 이미지 조정 컨트롤 패널
<div className="controls-panel">
  <div className="control-item">
    <label>크기: {settings.scale.toFixed(1)}x</label>
    <input
      type="range"
      min="0.1"
      max="3"
      step="0.1"
      value={settings.scale}
      onChange={(e) => onSettingsChange({ scale: parseFloat(e.target.value) })}
    />
  </div>

  <div className="control-item">
    <label>회전: {settings.rotation}°</label>
    <input
      type="range"
      min="0"
      max="360"
      step="1"
      value={settings.rotation}
      onChange={(e) => onSettingsChange({ rotation: parseInt(e.target.value) })}
    />
  </div>

  <div className="control-item">
    <label>투명도: {settings.opacity}%</label>
    <input
      type="range"
      min="0"
      max="100"
      step="1"
      value={settings.opacity}
      onChange={(e) => onSettingsChange({ opacity: parseInt(e.target.value) })}
    />
  </div>

  <div className="button-group">
    <button className="complete-button" onClick={onClose}>완료</button>
    <button className="reset-button" onClick={onReset}>초기화</button>
  </div>
</div>
```

## TypeScript 타입 정의

```typescript
// src/types/index.ts
export interface ImageSettings {
  scale: number;        // 0.1 ~ 3.0
  rotation: number;     // 0 ~ 360
  opacity: number;      // 0 ~ 100
  position: {
    x: number;
    y: number;
  };
}

export type AppStep =
  | 'initial'
  | 'permission'
  | 'ready'
  | 'camera_active'
  | 'image_selected';

export interface CameraState {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
}
```

## PWA 설정

### manifest.json
```json
{
  "name": "AR Drawing Helper",
  "short_name": "AR Draw",
  "description": "카메라를 활용한 그림 그리기 도우미",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2196F3",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ],
  "permissions": ["camera"]
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icons/*.svg'],
      manifest: {
        name: 'AR Drawing Helper',
        short_name: 'AR Draw',
        theme_color: '#2196F3',
        icons: [
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})
```

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Permissions-Policy = "camera=(self)"
```

## 개발 및 배포

### 로컬 개발
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 빌드
```bash
# TypeScript 컴파일 + Vite 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### Netlify 배포

#### Git 연동 배포 (권장)
1. GitHub에 코드 푸시
2. Netlify 대시보드 → "New site from Git"
3. 저장소 연결
4. Build settings 확인:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy site 클릭

#### CLI 배포
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

## 트러블슈팅

### 카메라 접근 안됨
- **원인**: HTTP 환경 또는 권한 거부
- **해결**: HTTPS 배포 (Netlify 자동 제공), 권한 재요청

### 이미지 선택 후 표시 안됨
- **원인**: Base64 변환 실패, LocalStorage 용량 초과
- **해결**: 이미지 크기 최적화, 에러 로깅 확인

### PWA 아이콘 표시 안됨
- **원인**: Manifest 경로 오류, 아이콘 파일 누락
- **해결**: `public/icon.svg` 파일 확인, 빌드 후 `dist/` 확인

### LocalStorage 저장 안됨
- **원인**: 프라이빗 모드, 용량 초과
- **해결**: 일반 모드 사용, 저장 데이터 최적화

### TypeScript 빌드 오류
- **원인**: 타입 불일치, 미사용 변수
- **해결**: `npx tsc --noEmit`로 타입 체크, 코드 수정

## 저작권 및 라이선스

- **저작권**: © HanTJ. All rights reserved.
- **라이선스**: MIT License
- **의견 및 후원**: https://taisou.tistory.com

## 참고 자료

### React & TypeScript
- [React 공식 문서](https://react.dev/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Vite 공식 문서](https://vitejs.dev/)

### Web APIs
- [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)

### PWA
- [PWA 가이드](https://web.dev/progressive-web-apps/)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

### 배포
- [Netlify 문서](https://docs.netlify.com/)
- [Netlify CLI](https://cli.netlify.com/)

## 버전 히스토리

### v1.0.0 (2025-10-18)
- 초기 릴리스
- 단계별 카메라 권한 관리
- 이미지 오버레이 + 조정 기능
- LocalStorage 설정 저장
- PWA 지원 (귀여운 강아지+펜 아이콘)
- Netlify 배포 완료
