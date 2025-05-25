import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';

interface ZipUploaderProps {
  onZipLoad: (files: { name: string; content: string }[]) => void;
}

const ZipUploader: React.FC<ZipUploaderProps> = ({ onZipLoad }) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        
        const files: { name: string; content: string }[] = [];
        
        for (const [path, zipEntry] of Object.entries(zipContent.files)) {
          if (zipEntry.dir) continue;
          if (!path.endsWith('.md')) continue;
          
          console.log('Processing file:', path);
          const content = await zipEntry.async('text');
          // Decode the path to handle spaces and special characters
          const decodedPath = decodeURIComponent(path);
          console.log('Decoded path:', decodedPath);
          console.log('Content length:', content.length);
          
          files.push({
            name: decodedPath,
            content
          });
        }
        
        console.log('All files:', files);
        onZipLoad(files);
      } catch (error) {
        console.error('Error processing zip file:', error);
        alert('Error processing zip file. Please make sure it\'s a valid zip file containing markdown files.');
      }
    },
    [onZipLoad]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'}
        hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isDragActive ? (
            <p>Drop the zip file here ...</p>
          ) : (
            <p>
              Drag and drop a zip file here, or click to select a file
            </p>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Only .zip files containing markdown files are supported
        </p>
      </div>
    </div>
  );
};

export default ZipUploader; 