// src/components/CenterPanel/Editor.tsx
'use client'

import React, { useEffect, useMemo } from 'react'
import { useFileSystem } from '@/contexts/FileSystemContext'
import { useEditor } from '@/contexts/EditorContext'
import { useGreenHighlight, useRedHighlight } from '@/contexts/HighlightContext'
import { Segment, FileContent, Word } from '../../types/transcript'

const Editor: React.FC = () => {
  const { selectedItems, files } = useFileSystem()
  const { content, setContent } = useEditor()
  const { highlights: greenHighlights } = useGreenHighlight()
  const { highlights: redHighlights } = useRedHighlight()

  useEffect(() => {
    const selectedFiles = selectedItems
      .map(id => files[id])
      .filter(file => file.type === 'file' || file.type === 'image')

    const mergedContent: FileContent[] = selectedFiles.map(file => JSON.parse(file.content))

    setContent(mergedContent)
  }, [selectedItems, files, setContent])

  useEffect(() => {
    console.log('Editor component updated');
    console.log('Green highlights:', greenHighlights);
    console.log('Red highlights:', redHighlights);
  }, [greenHighlights, redHighlights]);

  const getWordHighlight = useMemo(() => (fileId: string, segmentId: string, wordIndex: string) => {
    // Check if word is part of any green highlight
    const greenHighlight = greenHighlights.find(h => 
      h.fileId === fileId &&
      h.segmentId === segmentId &&
      parseInt(wordIndex) >= h.startWordIndex &&
      parseInt(wordIndex) <= h.endWordIndex
    )
  
    // Check if word is part of any red highlight
    const redHighlight = redHighlights.find(h => 
      h.fileId === fileId &&
      h.segmentId === segmentId &&
      parseInt(wordIndex) >= h.startWordIndex &&
      parseInt(wordIndex) <= h.endWordIndex
    )
  
    const highlightClass = greenHighlight ? 'bg-green-200' : (redHighlight ? 'bg-red-200' : '')
    
    if (highlightClass) {
      console.log(`Highlight applied: ${highlightClass} for fileId: ${fileId}, segmentId: ${segmentId}, wordIndex: ${wordIndex}`);
    }
  
    return highlightClass
  }, [greenHighlights, redHighlights])

  const renderContent = (file: FileContent, fileIndex: number) => {
    let currentSpeaker = ''
    let paragraphSegments: Segment[] = []
    let paragraphIndex = 0

    const renderSegment = (segment: Segment, segmentIndex: number, fileId: string) => {
      // Split the text into words, or use an empty array if text is undefined
      const words = segment.text?.split(' ') || [];
    
      return words.map((word, wordIndex) => {
        const highlightClass = getWordHighlight(
          fileId,
          segment.segment_id,
          wordIndex.toString()
        )
    
        //console.log(`Rendering word: "${word}", fileId: ${fileId}, segmentId: ${segment.segment_id}, wordIndex: ${wordIndex}, highlightClass: ${highlightClass}`);
    
        return (
          <span
            key={`${fileId}-seg${segment.segment_id}-word${wordIndex}`}
            className={`word-span ${highlightClass}`}
            data-file-id={fileId}
            data-segment-id={segment.segment_id}
            data-word-index={wordIndex.toString()}
          >
            {word}{' '}
          </span>
        )
      })
    }

    const renderParagraph = (segments: Segment[], index: number) => {
      const paragraphKey = `paragraph-${fileIndex}-${index}-${segments[0].segment_id}`

      return (
        <div 
          key={paragraphKey}
          className="mb-4 flex"
        >
          <div className="w-20 flex-shrink-0 text-right pr-4">
            <div className="text-gray-500 text-xs">{index + 1}</div>
            <div className="text-gray-400 text-xs">
              {formatTime(segments[0].start_time)} - {formatTime(segments[segments.length - 1].end_time)}
            </div>
          </div>
          <div className="flex-grow">
            <div className="font-bold">{segments[0].speaker}</div>
            <div>
              {segments.map((segment, idx) => renderSegment(segment, idx, file.file_info.file_id))}
            </div>
          </div>
        </div>
      )
    }

    return file.processed_data.transcript.segments.map((segment: Segment, index: number) => {
      if (segment.speaker !== currentSpeaker) {
        if (paragraphSegments.length > 0) {
          const paragraph = renderParagraph(paragraphSegments, paragraphIndex)
          paragraphSegments = [segment]
          currentSpeaker = segment.speaker
          paragraphIndex++
          return paragraph
        } else {
          currentSpeaker = segment.speaker
          paragraphSegments.push(segment)
          return null
        }
      } else {
        paragraphSegments.push(segment)
        if (index === file.processed_data.transcript.segments.length - 1) {
          return renderParagraph(paragraphSegments, paragraphIndex)
        }
        return null
      }
    }).filter(Boolean)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full w-full overflow-auto p-4">
      {content.map((file: FileContent, fileIndex: number) => (
        <div key={`file-${fileIndex}`} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{file.processed_data.media.source}</h2>
          {renderContent(file, fileIndex)}
        </div>
      ))}
    </div>
  )
}

export default Editor