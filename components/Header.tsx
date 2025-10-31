import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3">
        <SparklesIcon className="w-10 h-10 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          AI Image Stylist
        </h1>
      </div>
      <p className="mt-3 text-lg text-gray-400">
        Edit images with prompts or virtually try on clothes using Gemini.
      </p>
    </div>
  );
};

export default Header;
