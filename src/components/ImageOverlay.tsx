import { useRef, useState, useEffect } from 'react';
import { ImageSettings } from '../types';

interface ImageOverlayProps {
  imageUrl: string;
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  onClick?: () => void;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({
  imageUrl,
  settings,
  onSettingsChange,
  onClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  // 터치 이동 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setHasMoved(false);
      setDragStart({
        x: e.touches[0].clientX - settings.position.x,
        y: e.touches[0].clientY - settings.position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setHasMoved(true);

    const newX = e.touches[0].clientX - dragStart.x;
    const newY = e.touches[0].clientY - dragStart.y;

    onSettingsChange({
      position: { x: newX, y: newY }
    });
  };

  const handleTouchEnd = () => {
    if (!hasMoved && onClick) {
      onClick();
    }
    setIsDragging(false);
    setHasMoved(false);
  };

  // 마우스 이동 처리 (데스크톱 테스트용)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - settings.position.x,
      y: e.clientY - settings.position.y
    });
  };

  const handleClick = () => {
    if (!hasMoved && onClick) {
      onClick();
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setHasMoved(true);
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      onSettingsChange({
        position: { x: newX, y: newY }
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onSettingsChange]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `
          translate(-50%, -50%)
          translate(${settings.position.x}px, ${settings.position.y}px)
          scale(${settings.scale})
          rotate(${settings.rotation}deg)
        `,
        opacity: settings.opacity / 100,
        zIndex: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        userSelect: 'none',
        maxWidth: '90vw',
        maxHeight: '90vh'
      }}
    >
      <img
        src={imageUrl}
        alt="Overlay"
        draggable={false}
        style={{
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
