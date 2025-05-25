import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
}

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('markdown-notes');
    return saved ? JSON.parse(saved) : [{ id: '1', title: 'Note 1', content: '' }];
  });
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    localStorage.setItem('markdown-notes', JSON.stringify(notes));
  }, [notes]);

  const addNewNote = () => {
    const newId = (Math.max(...notes.map(n => parseInt(n.id))) + 1).toString();
    setNotes([...notes, { id: newId, title: `Note ${newId}`, content: '' }]);
    setActiveTab(newId);
  };

  const updateNoteTitle = (id: string, newTitle: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, title: newTitle } : note
    ));
  };

  const updateNoteContent = (id: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  const deleteNote = (id: string) => {
    if (notes.length === 1) return; // Don't delete the last note
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    if (activeTab === id) {
      setActiveTab(newNotes[0].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Notes</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => setActiveTab(note.id)}
              className={`flex items-center px-4 py-2 border-b-2 cursor-pointer ${
                activeTab === note.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => updateNoteTitle(note.id, e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-24"
                  onClick={(e) => e.stopPropagation()}
                />
                {notes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addNewNote}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Editor */}
        <div className="p-4">
          {notes.map(note => (
            <div key={note.id} className={activeTab === note.id ? '' : 'hidden'}>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={note.content}
                onEditorChange={(content: string) => updateNoteContent(note.id, content)}
                init={{
                  height: 400,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  skin: 'oxide-dark',
                  content_css: 'dark',
                  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesModal; 