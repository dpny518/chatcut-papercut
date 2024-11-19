// src/components/CenterPanel/EditorUtils/renderContent.tsx

import React from 'react';
import { FileContent, Segment, Word } from '../../../types/transcript';

interface ContentRendererProps {
  file: FileContent;
  fileIndex: number;
  getWordHighlight: (fileId: string, segmentId: string, wordIndex: string) => string;
}

const renderWord = (
  word: Word, 
  fileId: string, 
  segmentId: string, 
  segmentIndex: number,
  wordIndex: number,
  getWordHighlight: ContentRendererProps['getWordHighlight']
) => {
  const highlightClass = getWordHighlight(fileId, segmentId, word.word_index);

  return (
    <span
      key={`${fileId}-seg${segmentIndex}-word${wordIndex}`}
      className={`word-span cursor-pointer px-0.5 rounded ${highlightClass}`}
      data-file-id={fileId}
      data-segment-index={segmentIndex}
      data-word-index={wordIndex}
    >
      {word.word}{' '}
    </span>
  );
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const ContentRenderer: React.FC<ContentRendererProps> = ({ file, fileIndex, getWordHighlight }) => {
  const fileId = file.file_info.file_id;
  let currentSpeaker = '';
  let currentParagraph: React.ReactNode[] = [];
  const paragraphs: React.ReactNode[] = [];

  file.processed_data.transcript.segments.forEach((segment: Segment, segmentIndex: number) => {
    if (segment.speaker !== currentSpeaker && currentParagraph.length > 0) {
      // Start a new paragraph
      paragraphs.push(
        <div key={`paragraph-${fileId}-${paragraphs.length}`} className="mb-4 relative pl-16 pr-4 py-2 group hover:bg-gray-50">
          <div className="absolute left-0 top-0 w-14 h-full flex flex-col items-end pr-2 text-xs text-muted-foreground border-r border-muted">
            <span className="mt-2">{paragraphs.length + 1}</span>
            <span className="mt-1">{formatTime(segment.start_time)}</span>
          </div>
          <div className="text-sm font-bold text-primary mb-1">
            Speaker {currentSpeaker}
          </div>
          <div className="text-foreground">{currentParagraph}</div>
        </div>
      );
      currentParagraph = [];
    }

    currentSpeaker = segment.speaker;

    const wordElements = segment.words.map((word: Word, wordIndex: number) => 
      renderWord(word, fileId, segment.segment_id, segmentIndex, wordIndex, getWordHighlight)
    );

    currentParagraph.push(...wordElements);
  });

  // Add the last paragraph
  if (currentParagraph.length > 0) {
    const lastSegment = file.processed_data.transcript.segments[file.processed_data.transcript.segments.length - 1];
    paragraphs.push(
      <div key={`paragraph-${fileId}-${paragraphs.length}`} className="mb-4 relative pl-16 pr-4 py-2 group hover:bg-gray-50">
        <div className="absolute left-0 top-0 w-14 h-full flex flex-col items-end pr-2 text-xs text-muted-foreground border-r border-muted">
          <span className="mt-2">{paragraphs.length + 1}</span>
          <span className="mt-1">{formatTime(lastSegment.start_time)}</span>
        </div>
        <div className="text-sm font-bold text-primary mb-1">
          Speaker {currentSpeaker}
        </div>
        <div className="text-foreground">{currentParagraph}</div>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      {paragraphs}
    </div>
  );
};