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
  imageUrl?: string;    // 마지막 선택 이미지 (Base64 또는 Blob URL)
  timestamp: number;
}

export interface CameraState {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
}

export interface TouchPosition {
  x: number;
  y: number;
}

export interface GestureState {
  isDragging: boolean;
  isPinching: boolean;
  startDistance: number | null;
  startScale: number;
  startPosition: TouchPosition;
}

export type AppStep =
  | 'initial'           // 초기 화면
  | 'permission'        // 카메라 권한 요청
  | 'ready'             // 권한 획득 완료, 시작 대기
  | 'camera_active'     // 카메라 실행 중
  | 'image_selected';   // 이미지 선택 완료
