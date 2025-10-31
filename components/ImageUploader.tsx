import React, { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import type { ImageFile } from '../utils/fileUtils';
import { fileToImageFile } from '../utils/fileUtils';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile) => void;
  imagePreviewUrl: string | null;
  onRemoveImage: () => void;
  title: string;
  icon: React.ReactNode;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl, onRemoveImage, title, icon, id }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (file) {
      try {
        const imageFile = await fileToImageFile(file);
        onImageUpload(imageFile);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Please upload a valid image file.");
      }
    }
  }, [onImageUpload]);

  const onDragOver = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  if (imagePreviewUrl) {
    return (
      <div className="relative group w-full h-48">
        <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-md" />
        <button
          onClick={onRemoveImage}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'}`}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
        {icon}
        <p className="mb-2 text-sm font-semibold">{title}</p>
        <p className="text-xs">Click to upload or drag and drop</p>
      </div>
      <input id={id} type="file" className="hidden" accept="image/*" onChange={onInputChange} />
    </label>
  );
};

export default ImageUploader;
