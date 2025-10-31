import React, { useState, useCallback, useEffect } from 'react';
import { AppMode } from './types';
import type { ImageFile } from './utils/fileUtils';
import { editImageWithPrompt, performVirtualTryOn } from './services/geminiService';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ImageUploader from './components/ImageUploader';
import GeneratedImageView from './components/GeneratedImageView';
import ApiKeyModal from './components/ApiKeyModal';
import AspectRatioSelector from './components/AspectRatioSelector';
import { UploadIcon, PersonIcon, ShirtIcon, SpinnerIcon, KeyIcon } from './components/icons';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.EDIT);
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const [editImage, setEditImage] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('original');
  const [characterImage, setCharacterImage] = useState<ImageFile | null>(null);
  const [clothingImage, setClothingImage] = useState<ImageFile | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }, [apiKey]);

  const handleModeChange = useCallback((newMode: AppMode) => {
    setMode(newMode);
    setGeneratedImage(null);
    setError(null);
  }, []);
  
  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    setIsApiKeyModalOpen(false);
  };

  const handleGenerate = useCallback(async () => {
    if (!apiKey.trim()) {
      setError("Please add your Gemini API Key to proceed.");
      setIsApiKeyModalOpen(true);
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      let result: string;
      if (mode === AppMode.EDIT && editImage) {
        result = await editImageWithPrompt(editImage, prompt, apiKey, aspectRatio);
      } else if (mode === AppMode.TRY_ON && characterImage && clothingImage) {
        result = await performVirtualTryOn(characterImage, clothingImage, apiKey);
      } else {
        throw new Error("Invalid state for generation.");
      }
      setGeneratedImage(result);
    } catch (err: any) {
      let errorMessage = "An unknown error occurred.";
      if (err.message) {
        try {
          // Error messages from the backend can be nested JSON strings.
          // We try to parse them to get the most specific message.
          const outerError = JSON.parse(err.message);
          if (outerError.message) {
            errorMessage = outerError.message;
          } else if (outerError.error && typeof outerError.error === 'string') {
              try {
                const innerError = JSON.parse(outerError.error);
                if(innerError.message) {
                    errorMessage = innerError.message;
                } else {
                    errorMessage = outerError.error;
                }
              } catch (innerParseError) {
                errorMessage = outerError.error;
              }
          } else {
            errorMessage = err.message;
          }
        } catch (parseError) {
          // If parsing fails, it's probably not a JSON string, so use the raw message.
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [mode, editImage, prompt, characterImage, clothingImage, apiKey, aspectRatio]);
  
  const isGenerationDisabled = 
    isLoading || 
    (mode === AppMode.EDIT && (!editImage || prompt.trim().length === 0)) ||
    (mode === AppMode.TRY_ON && (!characterImage || !clothingImage));

  const originalImageForComparison = mode === AppMode.EDIT ? editImage?.dataUrl : characterImage?.dataUrl;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto relative">
        
        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          className="absolute top-0 right-0 z-10 flex items-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
        >
          <KeyIcon className="w-4 h-4" />
          {apiKey ? 'Change API Key' : 'Add API Key'}
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-6">
            <Header />
            <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
            
            {/* Control Panels */}
            {mode === AppMode.EDIT ? (
              <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <ImageUploader 
                  id="edit-image"
                  onImageUpload={setEditImage}
                  imagePreviewUrl={editImage?.dataUrl || null}
                  onRemoveImage={() => setEditImage(null)}
                  title="Upload Image to Edit"
                  icon={<UploadIcon className="w-10 h-10 mb-3" />}
                />
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your edit, e.g., 'Add a retro filter' or 'Make the sky purple'..."
                  className="w-full h-28 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
                <AspectRatioSelector
                    selectedRatio={aspectRatio}
                    onRatioChange={setAspectRatio}
                    disabled={isLoading}
                />
              </div>
            ) : (
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col gap-4">
                 <ImageUploader 
                  id="character-image"
                  onImageUpload={setCharacterImage}
                  imagePreviewUrl={characterImage?.dataUrl || null}
                  onRemoveImage={() => setCharacterImage(null)}
                  title="Upload Character Image"
                  icon={<PersonIcon className="w-10 h-10 mb-3" />}
                />
                 <ImageUploader 
                  id="clothing-image"
                  onImageUpload={setClothingImage}
                  imagePreviewUrl={clothingImage?.dataUrl || null}
                  onRemoveImage={() => setClothingImage(null)}
                  title="Upload Clothing Image"
                  icon={<ShirtIcon className="w-10 h-10 mb-3" />}
                />
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerationDisabled}
              className="w-full flex items-center justify-center py-4 px-6 text-lg font-bold rounded-lg transition-all duration-300 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="w-6 h-6 mr-3" />
                  Generating...
                </>
              ) : (
                'Generate Image'
              )}
            </button>
          </div>
          
          {/* Right Column: Display */}
          <div className="flex items-center justify-center lg:mt-0 mt-8">
            <GeneratedImageView 
              isLoading={isLoading}
              error={error}
              generatedImage={generatedImage}
              originalImage={originalImageForComparison || null}
            />
          </div>
        </div>
        
        <ApiKeyModal 
          isOpen={isApiKeyModalOpen}
          currentApiKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => setIsApiKeyModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default App;