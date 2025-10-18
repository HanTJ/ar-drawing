import { useState } from 'react';
import { AppStep } from './types';
import { useCamera } from './hooks/useCamera';
import { useImageSettings } from './hooks/useImageSettings';
import { Camera } from './components/Camera';
import { ImageOverlay } from './components/ImageOverlay';
import { Controls } from './components/Controls';
import { TransparentImageButton } from './components/TransparentImageButton';
import './App.css';

function App() {
  const [appStep, setAppStep] = useState<AppStep>('initial');
  const [showControls, setShowControls] = useState(false);

  const { stream, isActive, error, requestCameraPermission, startCamera } = useCamera();
  const { settings, imageUrl, updateSettings, updateImage, resetSettings } = useImageSettings();

  // 1. 초기 화면 - 카메라 권한 요청 버튼
  const handleRequestPermission = async () => {
    setAppStep('permission');
    const granted = await requestCameraPermission();
    if (granted) {
      setAppStep('ready');
    } else {
      setAppStep('initial');
    }
  };

  // 2. 그림 그리기 시작 버튼
  const handleStartDrawing = async () => {
    await startCamera();
    setAppStep('camera_active');
  };

  // 3. 이미지 선택 완료
  const handleImageSelect = (url: string) => {
    updateImage(url);
    setAppStep('image_selected');
    setShowControls(true);
  };

  // 4. 이미지 클릭 시 설정 패널 열기
  const handleImageClick = () => {
    setShowControls(true);
  };

  return (
    <div className="app">
      {/* 오류 메시지 */}
      {error && (
        <div className="error-message">
          <p>카메라 접근 오류: {error}</p>
          <p>카메라 권한을 허용해주세요.</p>
          <button onClick={handleRequestPermission}>다시 시도</button>
        </div>
      )}

      {/* 초기 화면 - 카메라 권한 요청 */}
      {appStep === 'initial' && !error && (
        <div className="welcome-screen">
          <h1>AR Drawing Helper</h1>
          <p>카메라를 사용하여 그림을 따라 그릴 수 있습니다</p>
          <button className="primary-button" onClick={handleRequestPermission}>
            카메라 권한 요청
          </button>
          <div className="footer-info">
            <p className="copyright">© HanTJ. All rights reserved.</p>
            <a href="https://taisou.tistory.com" target="_blank" rel="noopener noreferrer" className="support-link">
              의견 및 후원
            </a>
          </div>
        </div>
      )}

      {/* 권한 요청 중 */}
      {appStep === 'permission' && (
        <div className="loading">
          <p>카메라 권한을 확인하는 중...</p>
        </div>
      )}

      {/* 권한 획득 완료 - 그림 그리기 시작 버튼 */}
      {appStep === 'ready' && (
        <div className="ready-screen">
          <h2>AR Drawing Helper</h2>
          <p>준비가 완료되었습니다</p>
          <button className="start-button" onClick={handleStartDrawing}>
            그림 그리기 시작
          </button>
        </div>
      )}

      {/* 카메라 활성화 */}
      {(appStep === 'camera_active' || appStep === 'image_selected') && (
        <Camera stream={stream} isActive={isActive} />
      )}

      {/* 카메라 활성화 후 이미지 선택 버튼 */}
      {appStep === 'camera_active' && isActive && (
        <TransparentImageButton onImageSelect={handleImageSelect} />
      )}

      {/* 이미지 선택 완료 후 오버레이 */}
      {appStep === 'image_selected' && imageUrl && (
        <ImageOverlay
          imageUrl={imageUrl}
          settings={settings}
          onSettingsChange={updateSettings}
          onClick={handleImageClick}
        />
      )}

      {/* 이미지 조정 컨트롤 */}
      {appStep === 'image_selected' && imageUrl && showControls && (
        <Controls
          settings={settings}
          onSettingsChange={updateSettings}
          onReset={resetSettings}
          onClose={() => setShowControls(false)}
        />
      )}
    </div>
  );
}

export default App;
