import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import MarkdownViewer from "./components/MarkdownViewer";
import ZipUploader from "./components/ZipUploader";
import DarkModeToggle from "./components/DarkModeToggle";
import NotesModal from "./components/NotesModal";
import { useHashRoute } from "./hooks/useHashRoute";
import { flattenTree } from "./utils/treeUtils";
import type { FileEntry } from "./types";
import { saveFiles, loadFiles, clearFiles, supabase } from "./api/supabaseStorage";
import AuthPage from './Auth';
import type { User, Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [tree, setTree] = useState<FileEntry[] | null>(null);
  const [flattenedFiles, setFlattenedFiles] = useState<Record<string, FileEntry>>({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? JSON.parse(saved) : 18;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const currentFile = useHashRoute();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', JSON.stringify(fontSize));
  }, [fontSize]);

  useEffect(() => {
    const loadSupabaseFiles = async () => {
      const data = await loadFiles();
      if (data && data.length > 0) {
        const files = data.map(({ name, content }) => ({ name, content }));
        const tree = buildTree(files);
        setTree(tree);
        setFlattenedFiles(flattenTree(tree));
      }
    };
    loadSupabaseFiles();
  }, []);

  const buildTree = (files: { name: string; content: string }[]): FileEntry[] => {
    const tree: FileEntry[] = [];
    const map = new Map<string, FileEntry>();

    files.forEach(file => {
      const parts = file.name.split('/');
      let currentPath = '';
      let parent: FileEntry | undefined;

      parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (!map.has(currentPath)) {
          const node: FileEntry = {
            name: part,
            content: isLast ? file.content : '',
            isDir: !isLast,
            children: !isLast ? [] : undefined
          };
          map.set(currentPath, node);

          if (parent) {
            parent.children?.push(node);
          } else {
            tree.push(node);
          }
        }
        parent = map.get(currentPath);
      });
    });

    return tree;
  };

  const handleZipLoad = async (files: { name: string; content: string }[]) => {
    const tree = buildTree(files);
    setTree(tree);
    setFlattenedFiles(flattenTree(tree));
    await saveFiles(files);
  };

  const handleClear = async () => {
    setTree(null);
    setFlattenedFiles({});
    await clearFiles();
    window.location.hash = '';
  };

  // Close sidebar when clicking outside (on mobile)
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleClick = (e: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sidebarOpen]);

  if (!user) return <AuthPage />;

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:block h-full w-96">
        <Sidebar tree={tree} onClear={handleClear} />
      </div>
      {/* Sidebar for mobile (sliding drawer) */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-full bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-200 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar 
          tree={tree} 
          onClear={() => { setSidebarOpen(false); handleClear(); }} 
          onFileSelect={() => setSidebarOpen(false)}
        />
      </div>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-20">
          {/* Hamburger menu for mobile */}
          <button
            className="md:hidden p-2 mr-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold flex-1">Markdown Viewer</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFontSize((f: number) => Math.max(12, f - 2))} 
                className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                A-
              </button>
              <span className="text-sm w-12 text-center">{fontSize}px</span>
              <button 
                onClick={() => setFontSize((f: number) => Math.min(48, f + 2))} 
                className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                A+
              </button>
            </div>
            <button
              onClick={() => setIsNotesOpen(true)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
              title="Open Notes"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden md:inline">Notes</span>
            </button>
            <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {!tree ? (
            <ZipUploader onZipLoad={handleZipLoad} />
          ) : currentFile && flattenedFiles[currentFile] ? (
            <MarkdownViewer file={flattenedFiles[currentFile]} fontSize={fontSize} />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Select a markdown file from the sidebar
            </div>
          )}
        </div>
      </main>
      <NotesModal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </div>
  );
};

export default App; 