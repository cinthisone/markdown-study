# Technical Context

## Technology Stack

### Core Technologies
- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 5.2.2
- **Build Tool**: Vite 5.0.8
- **Package Manager**: npm

### Key Dependencies
1. **Markdown Processing**
   - react-markdown: ^9.0.1
   - remark-gfm: ^4.0.0
   - remark-math: ^6.0.0
   - rehype-katex: ^7.0.0
   - rehype-highlight: ^7.0.0

2. **File Handling**
   - jszip: ^3.10.1
   - idb-keyval: ^6.2.1
   - react-dropzone: ^14.2.3

3. **UI Components**
   - @dnd-kit/core: ^6.3.1
   - @dnd-kit/sortable: ^10.0.0
   - react-icons: ^5.5.0
   - tailwindcss: ^3.4.1

4. **Development Tools**
   - eslint: ^8.55.0
   - typescript: ^5.2.2
   - @typescript-eslint: ^6.14.0

## Development Setup

### Prerequisites
- Node.js (LTS version)
- npm
- Git

### Environment Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### Build Process
1. TypeScript compilation
2. Vite build
3. Asset optimization
4. Production bundle generation

## Technical Constraints

### Browser Support
- Modern browsers with ES6+ support
- IndexedDB support required
- File API support required

### Performance Limits
- Maximum ZIP size: 200MB
- IndexedDB storage limits
- Memory usage optimization

### Security Considerations
- Client-side only processing
- No sensitive data storage
- File type validation

## Development Workflow

### Code Organization
- `/src`: Source code
- `/public`: Static assets
- `/dist`: Build output
- `/memory-bank`: Documentation

### Testing Strategy
- Component testing
- Integration testing
- Performance testing
- Cross-browser testing

### Deployment
- Static file hosting
- GitHub Pages support
- Vercel deployment
- Custom domain support 