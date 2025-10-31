import React, { useState } from 'react';
import { SpinnerIcon, SparklesIcon, DownloadIcon } from './icons';

interface GeneratedImageViewProps {
  isLoading: boolean;
  error: string | null;
  generatedImage: string | null;
  originalImage: string | null;
}

const GeneratedImageView: React.FC<GeneratedImageViewProps> = ({ isLoading, error, generatedImage, originalImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="w-full aspect-square bg-gray-800 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden border border-gray-700 shadow-2xl">
      {isLoading && (
        <div className="flex flex-col items-center justify-center text-cyan-400">
          <SpinnerIcon className="w-16 h-16" />
          <p className="mt-4 text-lg font-semibold">Generating your image...</p>
          <p className="text-sm text-gray-400">This might take a moment.</p>
        </div>
      )}
      {!isLoading && error && (
        <div className="text-center text-red-400 px-6">
          <h3 className="text-lg font-bold">An Error Occurred</h3>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}
      {!isLoading && !error && !generatedImage && (
        <div className="text-center text-gray-500">
          <SparklesIcon className="w-20 h-20 mx-auto opacity-30" />
          <p className="mt-4 text-lg font-semibold">Your generated image will appear here</p>
          <p className="text-sm">Upload your assets and let the AI work its magic!</p>
        </div>
      )}
      {!isLoading && generatedImage && (
        <>
          {originalImage ? (
            <div className="w-full h-full relative select-none group animate-fade-in">
              <img
                src={originalImage}
                alt="Original"
                className="absolute inset-0 w-full h-full object-contain rounded-lg pointer-events-none"
              />
              <div
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={generatedImage}
                  alt="Generated result"
                  className="absolute inset-0 w-full h-full object-contain rounded-lg pointer-events-none"
                />
              </div>

              {/* Slider Controls */}
              <div className="absolute inset-0 cursor-col-resize">
                {/* Handle Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white/50 pointer-events-none group-hover:bg-white transition-colors duration-200"
                  style={{ left: `calc(${sliderPosition}% - 0.5px)` }}
                >
                  {/* Handle Circle */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 rounded-full bg-white/50 flex items-center justify-center shadow-md pointer-events-none group-hover:bg-white transition-colors duration-200">
                    <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8l-4 4 4 4m6-8l4 4-4 4" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <span className="absolute bottom-2 left-2 text-white text-xs font-bold py-1 px-2 rounded bg-black/50 pointer-events-none">Original</span>
              <span className="absolute bottom-2 right-2 text-white text-xs font-bold py-1 px-2 rounded bg-black/50 pointer-events-none">Generated</span>

              {/* Input Range */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full cursor-col-resize opacity-0"
                aria-label="Image comparison slider"
              />
            </div>
          ) : (
            <img
              src={generatedImage}
              alt="Generated result"
              className="w-full h-full object-contain rounded-lg animate-fade-in"
            />
          )}

          <a
            href={generatedImage}
            download="ai-styled-image.png"
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 z-20"
            aria-label="Download generated image"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Download</span>
          </a>
        </>
      )}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GeneratedImageView;
