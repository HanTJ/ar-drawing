import { ImageSettings, StoredSettings } from '../types';

const STORAGE_KEY = 'ar-drawing-settings';
const IMAGE_KEY = 'ar-drawing-image';

export const saveSettings = (settings: ImageSettings, imageUrl?: string): void => {
  try {
    const toStore: StoredSettings = {
      ...settings,
      imageUrl,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.error('설정 저장 실패:', error);
  }
};

export const loadSettings = (): StoredSettings | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as StoredSettings;
    }
  } catch (error) {
    console.error('설정 불러오기 실패:', error);
  }
  return null;
};

export const saveImageAsBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      try {
        localStorage.setItem(IMAGE_KEY, base64);
        resolve(base64);
      } catch (error) {
        // 용량 초과 시 압축된 버전 시도
        reject(new Error('이미지가 너무 큽니다. 작은 이미지를 선택해주세요.'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const loadSavedImage = (): string | null => {
  try {
    return localStorage.getItem(IMAGE_KEY);
  } catch (error) {
    console.error('이미지 불러오기 실패:', error);
    return null;
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(IMAGE_KEY);
  } catch (error) {
    console.error('저장소 초기화 실패:', error);
  }
};

export const getDefaultSettings = (): ImageSettings => ({
  scale: 1.0,
  rotation: 0,
  opacity: 50,
  position: { x: 0, y: 0 }
});
