// src/contexts/CopyContext.tsx
'use client'
import React, { createContext, useContext, useState } from 'react'

interface CopiedContent {
  text: string
  metadata: {
    sourceFile: string
    startSegment: string
    endSegment: string
    startWord: number
    endWord: number
  }
}


interface CopyContextType {
  copiedContent: CopiedContent | null
  setCopiedContent: (content: CopiedContent | null) => void
}

const CopyContext = createContext<CopyContextType | undefined>(undefined)

export const CopyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [copiedContent, setCopiedContent] = useState<CopiedContent | null>(null)

  return (
    <CopyContext.Provider value={{ copiedContent, setCopiedContent }}>
      {children}
    </CopyContext.Provider>
  )
}

export const useCopy = () => {
  const context = useContext(CopyContext)
  if (context === undefined) {
    throw new Error('useCopy must be used within a CopyProvider')
  }
  return context
}