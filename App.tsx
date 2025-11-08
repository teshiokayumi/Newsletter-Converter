
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ControlToolbar } from './components/ControlToolbar';
import { OutputDisplay } from './components/OutputDisplay';
import { translateAndExtractText } from './services/geminiService';
import { InputMethod, LanguageOption } from './types';
import { LANGUAGES } from './constants';

const App: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>('text');
  const [originalText, setOriginalText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setUploadedFile(file);
    setOriginalText(''); // Clear original text when a new file is uploaded
  };

  const handleTranslate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      let textToTranslate = originalText;
      let textSource = originalText;

      if (inputMethod === 'image' && uploadedFile) {
        const result = await translateAndExtractText(uploadedFile, targetLanguage.name);
        textSource = result.extractedText;
        textToTranslate = result.translatedText;
      } else if (inputMethod === 'text' && originalText) {
        const result = await translateAndExtractText(null, targetLanguage.name, originalText);
        textToTranslate = result.translatedText;
      } else {
        throw new Error('翻訳する内容がありません。');
      }

      setOriginalText(textSource);
      setTranslatedText(textToTranslate);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  }, [inputMethod, originalText, uploadedFile, targetLanguage]);
  
  const isTranslateDisabled = isLoading || (inputMethod === 'text' && !originalText) || (inputMethod !== 'text' && !uploadedFile);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InputArea
                inputMethod={inputMethod}
                setInputMethod={setInputMethod}
                originalText={originalText}
                setOriginalText={setOriginalText}
                onFileChange={handleFileChange}
                isLoading={isLoading}
              />
              <ControlToolbar
                targetLanguage={targetLanguage}
                setTargetLanguage={setTargetLanguage}
                onTranslate={handleTranslate}
                isDisabled={isTranslateDisabled}
                isLoading={isLoading}
              />
            </div>
            
            <OutputDisplay
              originalText={originalText}
              translatedText={translatedText}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;