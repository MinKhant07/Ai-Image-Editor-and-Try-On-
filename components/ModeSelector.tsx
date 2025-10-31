import React from 'react';
import { AppMode } from '../types';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const baseClasses = 'w-full py-3 px-4 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200';
  const activeClasses = 'bg-blue-600 text-white shadow-lg';
  const inactiveClasses = 'bg-gray-700 text-gray-300 hover:bg-gray-600';

  return (
    <div className="grid grid-cols-2 gap-4 p-2 bg-gray-800 rounded-xl">
      <button
        onClick={() => onModeChange(AppMode.EDIT)}
        className={`${baseClasses} ${currentMode === AppMode.EDIT ? activeClasses : inactiveClasses}`}
      >
        Image Edit
      </button>
      <button
        onClick={() => onModeChange(AppMode.TRY_ON)}
        className={`${baseClasses} ${currentMode === AppMode.TRY_ON ? activeClasses : inactiveClasses}`}
      >
        Virtual Try-On
      </button>
    </div>
  );
};

export default ModeSelector;
