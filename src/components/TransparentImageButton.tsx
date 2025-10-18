import './TransparentImageButton.css';

interface TransparentImageButtonProps {
  onImageSelect: (imageUrl: string) => void;
}

export const TransparentImageButton: React.FC<TransparentImageButtonProps> = ({
  onImageSelect
}) => {
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일을 선택해주세요.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onImageSelect(base64);
      };
      reader.onerror = () => {
        alert('이미지 로드에 실패했습니다.');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('이미지 로드 실패:', error);
      alert('이미지 로드에 실패했습니다.');
    }
  };

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleFileSelect as any;
    input.click();
  };

  return (
    <button
      className="transparent-image-button"
      onClick={handleClick}
      aria-label="이미지 선택"
    >
      <div className="button-content">
        <div className="plus-icon">+</div>
        <p>이미지 선택</p>
      </div>
    </button>
  );
};
