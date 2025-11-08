
import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const translateAndExtractText = async (
  file: File | null,
  targetLanguage: string,
  text?: string
): Promise<{ translatedText: string, extractedText: string }> => {
  if (!process.env.API_KEY) {
    throw new Error("APIキーが設定されていません。");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  let prompt = '';
  const parts: any[] = [];

  if (file) {
    prompt = `この画像から全ての日本語テキストを抽出し、その後、抽出したテキストを${targetLanguage}に翻訳してください。以下の形式で回答してください:
[抽出されたテキスト]
---
[翻訳されたテキスト]`;
    const imagePart = await fileToGenerativePart(file);
    parts.push(imagePart, { text: prompt });
  } else if (text) {
    prompt = `以下の日本語テキストを${targetLanguage}に翻訳してください:\n\n「${text}」`;
    parts.push({ text: prompt });
  } else {
    throw new Error("翻訳するテキストまたはファイルが指定されていません。");
  }

  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: parts },
  });

  const responseText = response.text;

  if (file) {
    const sections = responseText.split('---');
    if (sections.length === 2) {
      return {
        extractedText: sections[0].replace('[抽出されたテキスト]', '').trim(),
        translatedText: sections[1].replace('[翻訳されたテキスト]', '').trim()
      };
    } else {
       // If Gemini doesn't follow format, assume response is the translation of an unknown extract
      return {
        extractedText: '（画像からのテキスト抽出に失敗しました）',
        translatedText: responseText.trim(),
      };
    }
  } else {
    return {
      extractedText: text || '',
      translatedText: responseText.trim(),
    };
  }
};
