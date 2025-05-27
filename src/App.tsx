import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import MarkdownViewer from "./components/MarkdownViewer";
import ZipUploader from "./components/ZipUploader";
import DarkModeToggle from "./components/DarkModeToggle";
import NotesModal from "./components/NotesModal";
import { TodoList } from "./components/TodoList";
import { useHashRoute } from "./hooks/useHashRoute";
import { flattenTree } from "./utils/treeUtils";
import type { FileEntry } from "./types";
import { saveFiles, loadFiles, clearFiles, supabase } from "./api/supabaseStorage";
import AuthPage from './Auth';
import type { User, Session } from '@supabase/supabase-js';

const HelpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full p-6 z-10">
        <h2 className="text-xl font-bold mb-4">Help: How to Zip and Upload Your Notes</h2>
        <div className="mb-4 text-sm text-gray-800 dark:text-gray-200 space-y-2">
          <p>
            To quickly upload your notes to the Markdown Viewer, you can use a PowerShell script to zip your <code>C:\learn</code> folder and place the zip file in your Downloads folder. You can even assign a keyboard shortcut to run this script!
          </p>
          <p>Here is an example PowerShell script:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto"><code>{`
# Define source and destination
$source = "C:\\learn"
$destination = "$([Environment]::GetFolderPath('UserProfile'))\\Downloads\\mynotes.zip"
$winrar = "C:\\Program Files\\WinRAR\\WinRAR.exe"  # Adjust if needed

# Remove existing zip if it exists
if (Test-Path $destination) {
    Remove-Item $destination
}

# Change directory and run WinRAR from inside the source folder
Push-Location $source
& "$winrar" a -afzip -r "$destination" * 
Pop-Location
`}</code></pre>
          <p>
            <b>Instructions:</b>
            <ul className="list-disc ml-6">
              <li>Install <b>WinRAR</b> if you don&apos;t have it.</li>
              <li>Save the script as <code>zip-notes.ps1</code>.</li>
              <li>Assign a keyboard shortcut to run the script (optional, via Windows Task Scheduler or a hotkey tool).</li>
              <li>After running, upload <code>mynotes.zip</code> from your Downloads folder into the Markdown Viewer.</li>
            </ul>
          </p>
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
      </div>
    </div>
  );
};

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      console.log('Auth user on mount:', user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
      console.log('Auth state change:', session?.user);
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
    if (!user) return;
    const loadSupabaseFiles = async () => {
      console.log('Loading files for user:', user.id);
      const data = await loadFiles();
      console.log('Loaded files:', data);
      if (data && data.length > 0) {
        const files = data.map(({ name, content }) => ({ name, content }));
        const tree = buildTree(files);
        setTree(tree);
        setFlattenedFiles(flattenTree(tree));
      } else {
        setTree(null);
        setFlattenedFiles({});
      }
    };
    loadSupabaseFiles();
  }, [user]);

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

  // Close user menu on outside click (mobile)
  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e: MouseEvent) => {
      const menu = document.getElementById('user-menu-dropdown');
      if (menu && !menu.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  if (!user) return <AuthPage />;

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:block h-full w-96">
        <Sidebar tree={tree} onClear={handleClear} currentFilePath={currentFile} />
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
          currentFilePath={currentFile}
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
            <div className="relative z-50">
              <TodoList />
            </div>
            {/* Desktop: show Notes and dark mode toggle in header */}
            <button
              onClick={() => setIsNotesOpen(true)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 hidden md:flex"
              title="Open Notes"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden md:inline">Notes</span>
            </button>
            <span className="hidden md:inline">
              <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            </span>
            {user && (
              <>
                {/* Desktop: show email and logout */}
                <div className="hidden md:flex items-center gap-2 ml-4">
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                    }}
                    className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
                {/* Mobile: show avatar with dropdown */}
                <div className="relative md:hidden ml-2">
                  <button
                    onClick={() => setShowUserMenu((v: boolean) => !v)}
                    className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="User menu"
                  >
                    {user.email
                      ? user.email.split("@")[0].split(".").map(s => s[0]?.toUpperCase()).join("")
                      : "U"}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg z-50 py-2 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                        {user.email}
                      </div>
                      {/* Mobile: show Notes and dark mode toggle in dropdown */}
                      <button
                        onClick={() => {
                          setIsNotesOpen(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Open Notes"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Notes
                      </button>
                      <div className="px-4 py-2">
                        <DarkModeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
                      </div>
                      <button
                        onClick={async () => {
                          setShowUserMenu(false);
                          await supabase.auth.signOut();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                      {/* Mobile: show Help in dropdown */}
                      <button
                        onClick={() => {
                          setIsHelpOpen(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Help"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14h.01M16 10h.01M12 18h.01M12 6h.01" />
                        </svg>
                        Help
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
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
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App; 