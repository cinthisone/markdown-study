import React from 'react';
import type { FileEntry } from '../types';

interface SidebarProps {
  tree: FileEntry[] | null;
  onClear: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tree, onClear }) => {
  const renderFile = (file: FileEntry, path: string = '') => {
    const currentPath = path ? `${path}/${file.name}` : file.name;
    
    if (file.isDir) {
      return (
        <div key={currentPath} className="pl-4">
          <div className="font-semibold text-gray-400">{file.name}</div>
          {file.children?.map(child => renderFile(child, currentPath))}
        </div>
      );
    }

    return (
      <div
        key={currentPath}
        onClick={() => {
          window.location.hash = currentPath;
        }}
        className="pl-4 py-1 cursor-pointer hover:bg-gray-800 rounded"
      >
        {file.name}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Files</h2>
        {tree && (
          <button
            onClick={onClear}
            className="p-1 rounded hover:bg-gray-800"
            title="Clear files"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      <div className="space-y-1">
        {tree ? (
          tree.map(file => renderFile(file))
        ) : (
          <div className="text-gray-500">No files loaded</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 