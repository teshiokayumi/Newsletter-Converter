
import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, disabled }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="ここに日本語の原文を入力してください"
      className="w-full h-64 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
      aria-label="Original Japanese text input"
    />
  );
};
