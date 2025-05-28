# System Patterns

## Architecture Overview

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Routing**: Hash-based routing

### Key Components
1. **File Processing**
   - JSZip for archive handling
   - IndexedDB for offline storage
   - File system abstraction layer

2. **Markdown Rendering**
   - react-markdown as core renderer
   - remark-gfm for GitHub Flavored Markdown
   - rehype-highlight for code syntax
   - rehype-katex for math notation

3. **UI Components**
   - Drag-and-drop interface
   - File tree navigation
   - Theme switcher
   - Responsive layout

## Design Patterns

### Component Patterns
1. **Container/Presenter**
   - Container components handle logic
   - Presenter components handle rendering

2. **Custom Hooks**
   - File processing hooks
   - Theme management
   - Navigation state

3. **Context Providers**
   - Theme context
   - File system context
   - Navigation context

### State Management
1. **Local State**
   - Component-level UI state
   - Form state
   - Selection state

2. **Global State**
   - Theme preferences
   - File system state
   - Navigation state

## Critical Paths

### File Processing Flow
1. ZIP upload
2. Archive extraction
3. File indexing
4. Storage in IndexedDB
5. Content rendering

### Navigation Flow
1. Hash-based routing
2. File tree traversal
3. Content loading
4. History management

## Performance Considerations
1. **File Processing**
   - Chunked processing
   - Background workers
   - Caching strategies

2. **Rendering**
   - Virtual scrolling
   - Lazy loading
   - Memoization

3. **Storage**
   - Efficient IndexedDB usage
   - Cache invalidation
   - Storage quotas 