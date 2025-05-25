import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import type { FileEntry } from '../types';

export interface MarkdownViewerProps {
  file: FileEntry;
  fontSize: number;
}

// Function to strip HTML comments and tags from markdown content
const stripHtml = (content: string): string => {
  return content
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove extra blank lines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ file, fontSize }) => {
  if (!file || !file.content) {
    console.log('No file or content:', file);
    return <div className="text-gray-400">No content to display.</div>;
  }

  // Strip HTML comments and tags before rendering
  const cleanContent = stripHtml(file.content);

  return (
    <div style={{ fontSize }} className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        children={cleanContent}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
      />
    </div>
  );
};

export default MarkdownViewer; 