import React from 'react';

interface AspectRatioSelectorProps {
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
  disabled: boolean;
}

const ratios = [
  { value: 'original', label: 'Original' },
  { value: '1:1', label: 'Square' },
  { value: '16:9', label: 'Landscape' },
  { value: '9:16', label: 'Portrait' },
];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange, disabled }) => {
  const baseClasses = 'flex-1 py-2 px-3 text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const activeClasses = 'bg-blue-600 text-white shadow-md';
  const inactiveClasses = 'bg-gray-600 text-gray-300 hover:bg-gray-500';

  return (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
        <div className="flex items-center gap-2 p-1 bg-gray-700 rounded-lg">
        {ratios.map(({ value, label }) => (
            <button
            key={value}
            onClick={() => onRatioChange(value)}
            disabled={disabled}
            className={`${baseClasses} ${selectedRatio === value ? activeClasses : inactiveClasses}`}
            >
            {label}
            </button>
        ))}
        </div>
    </div>
  );
};

export default AspectRatioSelector;
