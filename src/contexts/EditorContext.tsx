// src/contexts/EditorContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { FileContent, Segment } from '../types/transcript'

interface Highlight {
  segmentId: string
  type: 'red' | 'green'
}

interface EditorContextType {
  content: FileContent[];
  setContent: (content: FileContent[]) => void;
  highlights: Highlight[];
  addHighlight: (segmentId: string, type: 'red' | 'green') => void;
  removeHighlight: (segmentId: string) => void;
  copiedText: string;
  setCopiedText: (text: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)


export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<FileContent[]>([])
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [copiedText, setCopiedText] = useState('')

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

  const setCopiedTextWithLog = useCallback((text: string) => {
    console.log('Setting copied text:', text)
    setCopiedText(text)
  }, [])

  return (
    <EditorContext.Provider value={{ 
      content, 
      setContent, 
      highlights, 
      addHighlight, 
      removeHighlight,
      copiedText,
      setCopiedText
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