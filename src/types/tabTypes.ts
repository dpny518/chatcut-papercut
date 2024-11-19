// src/types/tabTypes.ts
import { CopiedWord } from '@/contexts/CopyContext'

export interface TabMetadata {
  pastePosition: number;
  words: CopiedWord[];
}

export interface Tab {
  id: string;
  title: string;
  content: string;
  metadata: TabMetadata[];
}