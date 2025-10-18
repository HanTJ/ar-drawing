# AR Drawing Helper

카메라를 활용한 그림 그리기 도우미 PWA 웹앱입니다.

## 기능

- 따라 그릴 이미지 선택
- 카메라 화면에 이미지 반투명 오버레이
- 이미지 크기, 회전, 투명도, 위치 조정
- LocalStorage를 통한 설정 저장
- PWA 지원 (오프라인 사용 가능)

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

### Git 연동 배포

1. GitHub에 코드 푸시
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

# 배포
netlify deploy --prod
```

## 사용 방법

1. 앱 실행 시 카메라 권한 허용
2. "따라 그릴 이미지 선택" 버튼 클릭
3. 이미지 파일 선택
4. 하단 컨트롤로 이미지 조정:
   - 크기: 0.1x ~ 3.0x
   - 회전: 0° ~ 360°
   - 투명도: 0% ~ 100%
5. 이미지를 드래그하여 위치 이동
6. 설정은 자동으로 저장됨

## 기술 스택

- React 18
- TypeScript
- Vite
- PWA (vite-plugin-pwa)
- LocalStorage API
- MediaDevices API

## 브라우저 지원

- Chrome/Edge (데스크톱 및 모바일)
- Safari (iOS 및 macOS)
- Firefox

## 라이선스

MIT License
