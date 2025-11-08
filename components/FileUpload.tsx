
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept: string;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, accept, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      onFileChange(file);
      setFileName(file.name);
    } else {
      onFileChange(null);
      setFileName(null);
    }
  }, [onFileChange]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const dropzoneClasses = `
    w-full h-64 p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200
    ${disabled ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' :
    isDragging ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-300 hover:border-blue-400'}
  `;

  return (
    <div
      className={dropzoneClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      aria-disabled={disabled}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
      {fileName ? (
        <div className="text-gray-700">
          <p className="font-semibold">選択されたファイル:</p>
          <p className="text-sm break-all">{fileName}</p>
        </div>
      ) : (
        <div className="space-y-2 text-gray-500">
          <UploadIcon className="mx-auto h-12 w-12" />
          <p className="font-semibold">ファイルをドラッグ＆ドロップするか、クリックして選択</p>
          <p className="text-sm">画像ファイル (PNG, JPG) を選択</p>
        </div>
      )}
    </div>
  );
};