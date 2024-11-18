// src/contexts/EditorContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { FileContent } from '../types/transcript'

interface EditorContextType {
  content: FileContent[];
  setContent: (content: FileContent[]) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<FileContent[]>([])

  const setContentWithLog = useCallback((newContent: FileContent[]) => {
    console.log('Setting new content:', newContent)
    setContent(newContent)
  }, [])

  return (
    <EditorContext.Provider value={{ 
      content, 
      setContent: setContentWithLog, 
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