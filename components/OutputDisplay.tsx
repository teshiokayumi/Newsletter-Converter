
import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface OutputDisplayProps {
  originalText: string;
  translatedText: string;
  isLoading: boolean;
  error: string | null;
}

const OutputPanel: React.FC<{ title: string; text: string; children?: React.ReactNode; isLoading?: boolean }> = ({ title, text, children, isLoading }) => (
  <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
    <div className="prose prose-sm max-w-none w-full h-64 overflow-y-auto bg-white border border-gray-200 rounded-md p-3 flex-grow">
      {isLoading && !text ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="animate-pulse space-y-2 w-full">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      ) : (
        <pre className="whitespace-pre-wrap font-sans">{text || ' '}</pre>
      )}
    </div>
  </div>
);

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ originalText, translatedText, isLoading, error }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
        <p><strong>エラー:</strong> {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <OutputPanel title="原文 (日本語)" text={originalText} isLoading={isLoading && !originalText} />
      <OutputPanel title="翻訳結果" text={translatedText} isLoading={isLoading}>
        <button
          onClick={handleCopy}
          disabled={!translatedText || isLoading}
          className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
          title="クリップボードにコピー"
        >
          {isCopied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5 text-gray-500" />}
        </button>
      </OutputPanel>
    </div>
  );
};
