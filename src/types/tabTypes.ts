// src/types/tabTypes.ts

export interface TabMetadata {
    pastedText: string;
    pastePosition: number;
    sourceFile: string;
    startSegment: string;
    endSegment: string;
    startWord: number;
    endWord: number;
  }
  
  export interface Tab {
    id: string;
    title: string;
    content: string;
    metadata: TabMetadata[];
  }