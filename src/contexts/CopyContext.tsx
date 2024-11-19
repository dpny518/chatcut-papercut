// src/contexts/CopyContext.tsx

import React, { createContext, useContext, useState } from 'react'

export interface CopiedWord {
  sourceFile: string;
  sourceSegmentIndex: number;
  sourceWordIndex: number;
  word: string;
}

export interface CopiedContent {
  text: string;
  words: CopiedWord[];
}

interface CopyContextType {
  copiedContent: CopiedContent | null;
  setCopiedContent: (content: CopiedContent | null) => void;
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