import React, { useState } from 'react';
import type { FileEntry } from '../types';

interface SidebarProps {
  tree: FileEntry[] | null;
  onClear: () => void;
  onFileSelect?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tree, onClear, onFileSelect }) => {
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());

  const formatFileName = (name: string): string => {
    // Remove .md extension
    const withoutExt = name.replace(/\.md$/, '');
    // Replace underscores with spaces
    const withSpaces = withoutExt.replace(/_/g, ' ');
    // Capitalize each word
    return withSpaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const toggleFolder = (path: string) => {
    setCollapsedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFile = (file: FileEntry, path: string = '', level: number = 0) => {
    const currentPath = path ? `${path}/${file.name}` : file.name;
    
    if (file.isDir) {
      const isCollapsed = collapsedFolders.has(currentPath);
      return (
        <div key={currentPath} className="pl-4">
          <div 
            onClick={() => toggleFolder(currentPath)}
            className={`font-semibold cursor-pointer flex items-center gap-1 ${
              level === 0 ? 'text-green-500' : 
              level === 1 ? 'text-amber-700' : 
              'text-purple-500'
            }`}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {formatFileName(file.name)}
          </div>
          {!isCollapsed && file.children?.map(child => renderFile(child, currentPath, level + 1))}
        </div>
      );
    }

    return (
      <div
        key={currentPath}
        onClick={() => {
          window.location.hash = encodeURIComponent(currentPath);
          onFileSelect?.();
        }}
        className="pl-4 py-1 cursor-pointer hover:bg-gray-800 rounded"
      >
        {formatFileName(file.name)}
      </div>
    );
  };

  return (
    <div className="w-96 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
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