import { useRef, useEffect } from 'react';

interface CameraProps {
  stream: MediaStream | null;
  isActive: boolean;
}

export const Camera: React.FC<CameraProps> = ({ stream, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isActive) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 1
      }}
    />
  );
};
