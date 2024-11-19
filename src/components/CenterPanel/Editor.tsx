// src/components/CenterPanel/Editor.tsx

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useFileSystem } from '@/contexts/FileSystemContext'
import { useEditor } from '@/contexts/EditorContext'
import { useGreenHighlight, useRedHighlight } from '@/contexts/HighlightContext'
import { useCopy } from '@/contexts/CopyContext'
import { FileContent } from '../../types/transcript'
import { Mode } from '../../types/editor'
import { handleAction } from './EditorUtils/handleAction'
import { mergeSelectedFiles } from './EditorUtils/mergeSegments'
import { ContentRenderer } from './EditorUtils/renderContent'

interface EditorProps {
  activeMode: Mode
}

interface WordData {
  fileIndex: number;
  segmentIndex: number;
  wordIndex: number;
  word: string;
}

const Editor: React.FC<EditorProps> = ({ activeMode }) => {
  const { selectedItems, files } = useFileSystem()
  const { content, setContent } = useEditor()
  const { highlights: greenHighlights, addHighlight: addGreenHighlight } = useGreenHighlight()
  const { highlights: redHighlights, addHighlight: addRedHighlight } = useRedHighlight()
  const { copiedContent, setCopiedContent } = useCopy()
  const [selection, setSelection] = useState<WordData[] | null>(null)

  useEffect(() => {
    mergeSelectedFiles(selectedItems, files, setContent);
  }, [selectedItems, files, setContent])

  const getWordHighlight = useMemo(() => {
    return (fileId: string, segmentId: string, wordIndex: string): string => {
      const greenHighlight = greenHighlights.find(h => 
        h.fileId === fileId &&
        h.segmentId === segmentId &&
        parseInt(wordIndex) >= h.startWordIndex &&
        parseInt(wordIndex) <= h.endWordIndex
      )
    
      const redHighlight = redHighlights.find(h => 
        h.fileId === fileId &&
        h.segmentId === segmentId &&
        parseInt(wordIndex) >= h.startWordIndex &&
        parseInt(wordIndex) <= h.endWordIndex
      )
    
      return greenHighlight ? 'bg-highlight-green' : (redHighlight ? 'bg-highlight-red' : '')
    }
  }, [greenHighlights, redHighlights])

  const getSelectedWords = useCallback((range: Range): WordData[] => {
    const selectedWords: WordData[] = [];
    const allWordSpans = document.querySelectorAll('.word-span');
    let inSelection = false;

    allWordSpans.forEach((span) => {
      if (range.intersectsNode(span)) {
        const fileIndex = parseInt(span.closest('[data-file-index]')?.getAttribute('data-file-index') || '0');
        const segmentIndex = parseInt(span.getAttribute('data-segment-index') || '0');
        const wordIndex = parseInt(span.getAttribute('data-word-index') || '0');
        const word = span.textContent || '';

        selectedWords.push({ fileIndex, segmentIndex, wordIndex, word });
        inSelection = true;
      } else if (inSelection) {
        // We've passed the end of the selection
        return;
      }
    });

    return selectedWords;
  }, []);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const selectedWords = getSelectedWords(range);

    if (selectedWords.length > 0) {
      return selectedWords;
    }
    return null;
  }, [getSelectedWords]);

  const onMouseUp = useCallback((event: React.MouseEvent) => {
    const selectedWords = handleTextSelection();
    if (selectedWords) {
      setSelection(selectedWords);
      
      // Immediately handle the action based on the active mode
      handleAction(
        event,
        activeMode,
        setCopiedContent,
        addGreenHighlight,
        addRedHighlight,
        setContent,
        selectedWords
      );
    }
  }, [activeMode, setCopiedContent, addGreenHighlight, addRedHighlight, setContent, handleTextSelection]);

  return (
    <div 
      className="h-full overflow-auto px-4 py-2 editor-area"
      onMouseUp={onMouseUp}
    >
      <div className="text-xs text-gray-400 pb-4">Editor Area</div>
      {content.map((file, fileIndex) => (
        <div key={`file-${fileIndex}`} className="mb-8" data-file-index={fileIndex}>
          <h2 className="text-xl font-bold mb-4">{file.processed_data.media.source}</h2>
          <ContentRenderer
            file={file}
            fileIndex={fileIndex}
            getWordHighlight={getWordHighlight}
          />
        </div>
      ))}
      {copiedContent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
          <p>Copied: {copiedContent.words.length} words</p>
          <p>{copiedContent.text}</p>
        </div>
      )}
    </div>
  )
}

export default Editor