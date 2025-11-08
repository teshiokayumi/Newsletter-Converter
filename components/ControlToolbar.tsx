
import React from 'react';
import { LanguageOption } from '../types';
import { LANGUAGES } from '../constants';
import { TranslateIcon, LoadingSpinnerIcon } from './icons';

interface ControlToolbarProps {
  targetLanguage: LanguageOption;
  setTargetLanguage: (lang: LanguageOption) => void;
  onTranslate: () => void;
  isDisabled: boolean;
  isLoading: boolean;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  targetLanguage,
  setTargetLanguage,
  onTranslate,
  isDisabled,
  isLoading,
}) => {
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = LANGUAGES.find(lang => lang.code === e.target.value);
    if (selectedLang) {
      setTargetLanguage(selectedLang);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-100 rounded-lg">
      <div className="w-full sm:w-auto flex-grow">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
          翻訳先の言語
        </label>
        <select
          id="language-select"
          value={targetLanguage.code}
          onChange={handleLanguageChange}
          disabled={isLoading}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onTranslate}
        disabled={isDisabled}
        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? (
          <>
            <LoadingSpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            処理中...
          </>
        ) : (
          <>
            <TranslateIcon className="-ml-1 mr-2 h-5 w-5" />
            翻訳する
          </>
        )}
      </button>
    </div>
  );
};
