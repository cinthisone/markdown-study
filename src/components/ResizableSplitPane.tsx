import React, { useState, useRef, useEffect } from 'react';

interface ResizableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  left,
  right,
  defaultLeftWidth = 256, // 16rem
  minLeftWidth = 200,
  maxLeftWidth = 500,
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = Math.min(
        Math.max(e.clientX - containerRect.left, minLeftWidth),
        maxLeftWidth
      );
      setLeftWidth(newLeftWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minLeftWidth, maxLeftWidth]);

  return (
    <div ref={containerRef} className="flex h-full relative">
      <div style={{ width: leftWidth }} className="flex-shrink-0 h-full">
        {left}
      </div>
      <div
        className={`w-1 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 ${
          isDragging ? 'bg-blue-500' : 'bg-gray-700'
        }`}
        onMouseDown={() => setIsDragging(true)}
        style={{ zIndex: 10 }}
      />
      <div className="flex-1 h-full overflow-auto">
        {right}
      </div>
    </div>
  );
};

export default ResizableSplitPane; 