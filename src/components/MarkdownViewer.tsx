import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import type { FileEntry } from '../types';

export interface MarkdownViewerProps {
  file: FileEntry;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ file }) => {
  const [fontSize, setFontSize] = useState(18);

  if (!file || !file.content) {
    return <div className="text-gray-400">No content to display.</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => setFontSize((f) => Math.max(12, f - 2))} className="px-2 py-1 border rounded">A-</button>
        <span className="text-sm">Font size: {fontSize}px</span>
        <button onClick={() => setFontSize((f) => Math.min(48, f + 2))} className="px-2 py-1 border rounded">A+</button>
      </div>
      <div style={{ fontSize }} className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          children={file.content}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        />
      </div>
    </div>
  );
};

export default MarkdownViewer; 