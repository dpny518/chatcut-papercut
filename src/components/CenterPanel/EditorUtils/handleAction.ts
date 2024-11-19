// src/components/CenterPanel/EditorUtils/handleAction.ts

import { Mode } from '../../../types/editor';
import { CopiedContent } from '../../../contexts/CopyContext';
import { FileContent } from '../../../types/transcript';
import { Highlight, HighlightType } from '../../../contexts/HighlightContext';

interface WordData {
  fileIndex: number;
  segmentIndex: number;
  wordIndex: number;
  word: string;
}

export const handleAction = (
  event: React.MouseEvent,
  activeMode: Mode,
  setCopiedContent: (content: CopiedContent) => void,
  addGreenHighlight: (highlight: Highlight) => void,
  addRedHighlight: (highlight: Highlight) => void,
  setContent: React.Dispatch<React.SetStateAction<FileContent[]>>,
  selection: WordData[]
) => {
  if (selection.length === 0) return;

  const firstWord = selection[0];
  const lastWord = selection[selection.length - 1];

  const fileId = `file-${firstWord.fileIndex}`;
  const segmentId = `segment-${firstWord.segmentIndex}`;
  const startWordIndex = firstWord.wordIndex;
  const endWordIndex = lastWord.wordIndex;
  const text = selection.map(w => w.word).join(' ');

  switch (activeMode) {
    case 'copy':
      const copiedContent: CopiedContent = {
        text,
        words: selection.map(w => ({
          sourceFile: w.fileIndex.toString(),
          sourceSegmentIndex: w.segmentIndex,
          sourceWordIndex: w.wordIndex,
          word: w.word
        }))
      };
      setCopiedContent(copiedContent);
      break;

    case 'green':
      addGreenHighlight({
        fileId,
        segmentId,
        startWordIndex,
        endWordIndex,
        text,
        type: 'green'
      });
      break;

    case 'red':
      addRedHighlight({
        fileId,
        segmentId,
        startWordIndex,
        endWordIndex,
        text,
        type: 'red'
      });
      break;

    case 'delete':
      setContent(prevContent => {
        return prevContent.map((file, fileIndex) => {
          if (fileIndex !== firstWord.fileIndex) return file;

          const updatedSegments = file.processed_data.transcript.segments.map((segment, segmentIndex) => {
            if (segmentIndex !== firstWord.segmentIndex) return segment;

            const updatedWords = segment.words.filter((_, wordIndex) => 
              wordIndex < startWordIndex || wordIndex > endWordIndex
            );

            return {
              ...segment,
              words: updatedWords,
              text: updatedWords.map(w => w.word).join(' ')
            };
          });

          return {
            ...file,
            processed_data: {
              ...file.processed_data,
              transcript: {
                ...file.processed_data.transcript,
                segments: updatedSegments
              }
            }
          };
        });
      });
      break;

    default:
      console.log('Unknown mode:', activeMode);
  }
};