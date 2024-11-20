This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
Project Summary: We've created a Next.js application called "ChatCut PaperCut," which is an editor application with a three-panel layout. The application consists of:

A left sidebar with a collapsible file structure
A center panel with a toolbar and text editor
A right panel with a tab system for additional content or tools
The application uses the App Router structure of Next.js and incorporates components from shadcn/ui, particularly for the sidebar. We're using TypeScript for type safety and Tailwind CSS for styling.

File Structure:

Project Structure:
```
/src
  /app - Next.js app router structure
  /components - React components including Editor, Panels
  /contexts - React context providers for state management
  /services - API and file system services
  /types - TypeScript type definitions
/backend
  /app
    /api - FastAPI endpoints
    /services - File processing and handlers
```

Data Flow:

1. File Upload Flow:
- User selects file(s) in the frontend
- FileSystemContext.tsx handles the upload via `addFile()` function
- Files are sent to backend endpoint `http://52.76.236.100:8000/api/v1/upload`
- Backend `file_processor.py` processes the file based on type:
  - docx_handler.py for .docx files
  - srtx_handler.py for .srtx files 
  - json_handler.py for .json files
  - Each handler parses into a common transcript schema

2. State Management (Contexts):
- FileSystemContext: Manages uploaded files and file tree structure
- EditorContext: Manages the editor content and state
- HighlightContext: Manages green/red highlights
- CopyContext: Manages copied text selections

3. Editor & Selection Flow:
- Selected files are merged in CenterPanel/Editor.tsx
- Editor uses ContentRenderer to display transcript segments
- Users can:
  - Select text which triggers handleTextSelection()
  - Highlight selections in green/red via HighlightContext
  - Copy selections via CopyContext
  - See speaker names, timestamps, and transcript text

4. Data Schema:
The transcript schema (transcript.ts) includes:
- Words with timing info
- Segments with speaker and timing
- Project metadata
- File info for original/processed paths

5. Key Components:
- CenterPanel: Main editor area
- LeftPanel: File structure/navigation
- RightPanel: Additional tools/info
- Editor: Core transcript editing component

The project follows a clean architecture with:
- Clear separation between frontend/backend
- Context-based state management
- Consistent file processing pipeline
- TypeScript for type safety
- Component-based UI structure