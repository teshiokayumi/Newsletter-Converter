
import React from 'react';
import { InputMethod } from '../types';
import { TextInput } from './TextInput';
import { FileUpload } from './FileUpload';

interface InputAreaProps {
  inputMethod: InputMethod;
  setInputMethod: (method: InputMethod) => void;
  originalText: string;
  setOriginalText: (text: string) => void;
  onFileChange: (file: File | null) => void;
  isLoading: boolean;
}

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ label, isActive, onClick, disabled }) => {
  const baseClasses = "flex-1 py-3 px-4 text-center font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md";
  const activeClasses = "bg-blue-600 text-white shadow";
  const inactiveClasses = "bg-gray-200 text-gray-600 hover:bg-gray-300";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {label}
    </button>
  );
};

export const InputArea: React.FC<InputAreaProps> = ({
  inputMethod,
  setInputMethod,
  originalText,
  setOriginalText,
  onFileChange,
  isLoading,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        <TabButton label="テキスト入力" isActive={inputMethod === 'text'} onClick={() => setInputMethod('text')} disabled={isLoading} />
        <TabButton label="画像から読込" isActive={inputMethod === 'image'} onClick={() => setInputMethod('image')} disabled={isLoading} />
      </div>
      
      <div>
        {inputMethod === 'text' ? (
          <TextInput value={originalText} onChange={setOriginalText} disabled={isLoading} />
        ) : (
          <FileUpload
            onFileChange={onFileChange}
            accept={'image/png, image/jpeg'}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
};