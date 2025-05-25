import React, { useState, useEffect } from 'react';
import type { FileEntry } from '../types';

interface SidebarProps {
  tree: FileEntry[] | null;
  onClear: () => void;
  onFileSelect?: () => void;
}

const CHECKED_KEY = 'sidebar-checked-files';

const Sidebar: React.FC<SidebarProps> = ({ tree, onClear, onFileSelect }) => {
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [checkedFiles, setCheckedFiles] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(CHECKED_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(CHECKED_KEY, JSON.stringify(Array.from(checkedFiles)));
  }, [checkedFiles]);

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

  const toggleCheck = (path: string) => {
    setCheckedFiles(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const clearAllCheckmarks = () => {
    setCheckedFiles(new Set());
  };

  const renderFile = (file: FileEntry, path: string = '', level: number = 0) => {
    const currentPath = path ? `${path}/${file.name}` : file.name;
    const isChecked = checkedFiles.has(currentPath);

    if (file.isDir) {
      const isCollapsed = collapsedFolders.has(currentPath);
      return (
        <div key={currentPath} className="pl-4">
          <div 
            className={`font-semibold cursor-pointer flex items-center gap-1 select-none ${
              level === 0 ? 'text-green-500' : 
              level === 1 ? 'text-amber-700' : 
              'text-purple-500'
            }`}
          >
            <span onClick={() => toggleFolder(currentPath)} className="flex items-center gap-1 flex-1">
              <svg 
                className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {formatFileName(file.name)}
            </span>
            <button
              onClick={e => { e.stopPropagation(); toggleCheck(currentPath); }}
              className="ml-1 p-0.5 rounded focus:outline-none hover:bg-gray-800"
              title={isChecked ? 'Uncheck' : 'Check'}
              tabIndex={0}
            >
              {isChecked ? (
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                </svg>
              )}
            </button>
          </div>
          {!isCollapsed && file.children?.map(child => renderFile(child, currentPath, level + 1))}
        </div>
      );
    }

    return (
      <div
        key={currentPath}
        className="pl-4 flex items-center"
      >
        <div
          onClick={() => {
            window.location.hash = encodeURIComponent(currentPath);
            onFileSelect?.();
          }}
          className="py-1 cursor-pointer hover:bg-gray-800 rounded flex-1 select-none"
        >
          {formatFileName(file.name)}
        </div>
        <button
          onClick={e => { e.stopPropagation(); toggleCheck(currentPath); }}
          className="ml-1 p-0.5 rounded focus:outline-none hover:bg-gray-800"
          title={isChecked ? 'Uncheck' : 'Check'}
          tabIndex={0}
        >
          {isChecked ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="3" />
            </svg>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="w-96 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Files</h2>
        <div className="flex gap-2">
          <button
            onClick={clearAllCheckmarks}
            className="p-1 rounded hover:bg-gray-800 text-green-500 border border-green-500"
            title="Clear all checkmarks"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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