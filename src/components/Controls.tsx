import { ImageSettings } from '../types';
import './Controls.css';

interface ControlsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  onReset: () => void;
  onClose: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  settings,
  onSettingsChange,
  onReset,
  onClose
}) => {
  return (
    <div className="controls">
      <div className="controls-container">
        <h3>이미지 조정</h3>

        <div className="control-group">
          <label>
            크기: {settings.scale.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={settings.scale}
            onChange={(e) => onSettingsChange({ scale: parseFloat(e.target.value) })}
          />
        </div>

        <div className="control-group">
          <label>
            회전: {settings.rotation}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={settings.rotation}
            onChange={(e) => onSettingsChange({ rotation: parseInt(e.target.value) })}
          />
        </div>

        <div className="control-group">
          <label>
            투명도: {settings.opacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={settings.opacity}
            onChange={(e) => onSettingsChange({ opacity: parseInt(e.target.value) })}
          />
        </div>

        <div className="button-group">
          <button className="complete-button" onClick={onClose}>
            완료
          </button>
          <button className="reset-button" onClick={onReset}>
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};
