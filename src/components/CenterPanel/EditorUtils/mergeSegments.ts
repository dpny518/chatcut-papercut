// src/components/CenterPanel/EditorUtils/mergeSegments.ts

import React from 'react';
import { FileContent, Segment } from '../../../types/transcript';

export const mergeSelectedFiles = (
  selectedItems: string[],
  files: { [key: string]: { type: string, content: string, name: string } },
  setContent: React.Dispatch<React.SetStateAction<FileContent[]>>
) => {
  const selectedFiles = selectedItems
    .map(id => files[id])
    .filter(file => file.type === 'file' || file.type === 'image');

  const mergedContent: FileContent[] = selectedFiles.map(file => {
    const parsedContent = JSON.parse(file.content);
    // Replace the source file name with the name from AppSidebar
    parsedContent.processed_data.media.source = file.name;
    return parsedContent;
  });

  setContent(mergedContent);
};

export const mergeSelectedSegments = (
  selectedSegments: string[],
  setContent: React.Dispatch<React.SetStateAction<FileContent[]>>,
  setSelectedSegments: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (selectedSegments.length !== 2) return;

  setContent(prevContent => 
    prevContent.map(file => {
      const updatedSegments = file.processed_data.transcript.segments.reduce((acc, segment) => {
        if (segment.segment_id === selectedSegments[0]) {
          const nextSegment = file.processed_data.transcript.segments.find(
            s => s.segment_id === selectedSegments[1]
          );
          if (nextSegment) {
            acc.push({
              ...segment,
              text: `${segment.text} ${nextSegment.text}`,
              end_time: nextSegment.end_time,
              words: [...segment.words, ...nextSegment.words]
            });
          } else {
            acc.push(segment);
          }
        } else if (segment.segment_id !== selectedSegments[1]) {
          acc.push(segment);
        }
        return acc;
      }, [] as Segment[]);

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
    })
  );
  setSelectedSegments([]);
};