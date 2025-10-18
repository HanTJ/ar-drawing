import { useState, useEffect, useCallback } from 'react';
import { ImageSettings } from '../types';
import { loadSettings, saveSettings, getDefaultSettings } from '../utils/storage';

export const useImageSettings = () => {
  const [settings, setSettings] = useState<ImageSettings>(getDefaultSettings());
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 초기 설정 불러오기
  useEffect(() => {
    const loaded = loadSettings();
    if (loaded) {
      setSettings({
        scale: loaded.scale,
        rotation: loaded.rotation,
        opacity: loaded.opacity,
        position: loaded.position
      });
      if (loaded.imageUrl) {
        setImageUrl(loaded.imageUrl);
      }
    }
  }, []);

  // 설정 업데이트 및 저장
  const updateSettings = useCallback((newSettings: Partial<ImageSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated, imageUrl || undefined);
      return updated;
    });
  }, [imageUrl]);

  // 이미지 설정
  const updateImage = useCallback((url: string) => {
    setImageUrl(url);
    saveSettings(settings, url);
  }, [settings]);

  // 설정 초기화
  const resetSettings = useCallback(() => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    saveSettings(defaults, imageUrl || undefined);
  }, [imageUrl]);

  return {
    settings,
    imageUrl,
    updateSettings,
    updateImage,
    resetSettings
  };
};
