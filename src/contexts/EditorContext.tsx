// src/contexts/EditorContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { FileContent } from '../types/transcript'

interface Highlight {
  segmentId: string
  type: 'red' | 'green'
}

interface CopiedContent {
  text: string
  metadata: any
}

interface EditorContextType {
  content: FileContent[];
  setContent: (content: FileContent[]) => void;
  highlights: Highlight[];
  addHighlight: (segmentId: string, type: 'red' | 'green') => void;
  removeHighlight: (segmentId: string) => void;
  copiedContent: CopiedContent | null;
  setCopiedContent: (content: CopiedContent | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<FileContent[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [copiedContent, setCopiedContent] = useState<CopiedContent | null>(null)

  const addHighlight = useCallback((segmentId: string, type: 'red' | 'green') => {
    setHighlights(prev => [...prev.filter(h => h.segmentId !== segmentId), { segmentId, type }])
  }, [])

  const removeHighlight = useCallback((segmentId: string) => {
    setHighlights(prev => prev.filter(h => h.segmentId !== segmentId))
  }, [])

  const setContentWithLog = useCallback((newContent: FileContent[]) => {
    console.log('Setting new content:', newContent)
    setContent(newContent)
  }, [])

  return (
    <EditorContext.Provider value={{ 
      content, 
      setContent: setContentWithLog, 
      highlights, 
      addHighlight, 
      removeHighlight,
      copiedContent,
      setCopiedContent
    }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}