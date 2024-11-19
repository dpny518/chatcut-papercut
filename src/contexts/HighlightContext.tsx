// src/contexts/HighlightContext.tsx
'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

const createLogger = (namespace: string) => ({
  log: (...args: any[]) => console.log(`[${namespace}]`, ...args),
  error: (...args: any[]) => console.error(`[${namespace}]`, ...args),
  warn: (...args: any[]) => console.warn(`[${namespace}]`, ...args),
  info: (...args: any[]) => console.info(`[${namespace}]`, ...args),
});
export type HighlightType = 'green' | 'red';

export interface Highlight {
  fileId: string;
  segmentId: string;
  startWordIndex: number;
  endWordIndex: number;
  text: string;
  type: HighlightType;
}

interface HighlightContextType {
  highlights: Highlight[]
  addHighlight: (highlight: Highlight) => void
  removeHighlight: (fileId: string, segmentId: string, startWordIndex: number, endWordIndex: number) => void
}

const GreenHighlightContext = createContext<HighlightContextType | undefined>(undefined)
const RedHighlightContext = createContext<HighlightContextType | undefined>(undefined)

const createHighlightProvider = (Context: React.Context<HighlightContextType | undefined>, type: HighlightType) => {
  return ({ children }: { children: React.ReactNode }) => {
    const [highlights, setHighlights] = useState<Highlight[]>([])
    const logger = createLogger(`HighlightContext:${type}`);

    useEffect(() => {
      logger.info('Highlights updated:', highlights);
    }, [highlights]);

    const addHighlight = (highlight: Highlight) => {
      setHighlights(prev => {
        logger.log('Adding highlight:', highlight);
        logger.log('Previous highlights:', prev);
        const newHighlights = [...prev, highlight];
        logger.log('New highlights:', newHighlights);
        return newHighlights;
      });
    }

    const removeHighlight = (fileId: string, segmentId: string, startWordIndex: number, endWordIndex: number) => {
      setHighlights(prev => {
        logger.log('Removing highlight:', { fileId, segmentId, startWordIndex, endWordIndex });
        logger.log('Previous highlights:', prev);
        const newHighlights = prev.filter(h => 
          h.fileId !== fileId || 
          h.segmentId !== segmentId || 
          h.startWordIndex !== startWordIndex || 
          h.endWordIndex !== endWordIndex
        );
        logger.log('New highlights:', newHighlights);
        return newHighlights;
      });
    }

    return (
      <Context.Provider value={{ highlights, addHighlight, removeHighlight }}>
        {children}
      </Context.Provider>
    )
  }
}

export const GreenHighlightProvider = createHighlightProvider(GreenHighlightContext, 'green')
export const RedHighlightProvider = createHighlightProvider(RedHighlightContext, 'red')

export const useGreenHighlight = () => {
  const context = useContext(GreenHighlightContext)
  if (context === undefined) {
    throw new Error('useGreenHighlight must be used within a GreenHighlightProvider')
  }
  return context
}

export const useRedHighlight = () => {
  const context = useContext(RedHighlightContext)
  if (context === undefined) {
    throw new Error('useRedHighlight must be used within a RedHighlightProvider')
  }
  return context
}