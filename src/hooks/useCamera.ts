import { useState, useCallback } from 'react';
import { CameraState } from '../types';

export const useCamera = () => {
  const [cameraState, setCameraState] = useState<CameraState>({
    stream: null,
    isActive: false,
    error: null
  });

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      // 권한 획득 후 즉시 스트림 종료 (아직 시작 안함)
      stream.getTracks().forEach(track => track.stop());

      setCameraState({
        stream: null,
        isActive: false,
        error: null
      });

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카메라 접근 실패';
      setCameraState({
        stream: null,
        isActive: false,
        error: errorMessage
      });
      console.error('카메라 권한 요청 오류:', error);
      return false;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setCameraState({
        stream,
        isActive: true,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '카메라 시작 실패';
      setCameraState({
        stream: null,
        isActive: false,
        error: errorMessage
      });
      console.error('카메라 시작 오류:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
      setCameraState({
        stream: null,
        isActive: false,
        error: null
      });
    }
  }, [cameraState.stream]);

  return {
    ...cameraState,
    requestCameraPermission,
    startCamera,
    stopCamera
  };
};
