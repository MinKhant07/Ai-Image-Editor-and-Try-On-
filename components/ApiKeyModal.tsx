import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  currentApiKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, currentApiKey, onSave, onClose }) => {
  const [localApiKey, setLocalApiKey] = useState(currentApiKey);

  useEffect(() => {
    setLocalApiKey(currentApiKey);
  }, [currentApiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localApiKey);
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-white">Your Gemini API Key</h2>
        <p className="text-sm text-gray-400 mb-4">
          Your key is stored securely in your browser's local storage and is never sent to any servers.
        </p>
        <input
          type="password"
          value={localApiKey}
          onChange={(e) => setLocalApiKey(e.target.value)}
          placeholder="Enter your Gemini API Key"
          className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white"
        />
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ApiKeyModal;
