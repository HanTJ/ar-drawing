import { useRef } from 'react';
import { saveImageAsBase64 } from '../utils/storage';
import './ImagePicker.css';

interface ImagePickerProps {
  onImageSelect: (imageUrl: string) => void;
  hasImage: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  onImageSelect,
  hasImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일을 선택해주세요.');
      return;
    }

    try {
      const base64 = await saveImageAsBase64(file);
      onImageSelect(base64);
    } catch (error) {
      console.error('이미지 로드 실패:', error);
      alert(error instanceof Error ? error.message : '이미지 로드에 실패했습니다.');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-picker">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        className={`picker-button ${hasImage ? 'has-image' : ''}`}
        onClick={handleButtonClick}
      >
        {hasImage ? '다른 이미지 선택' : '따라 그릴 이미지 선택'}
      </button>
    </div>
  );
};
