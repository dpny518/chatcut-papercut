// src/components/CenterPanel/Editor.tsx
'use client'

import React, { useEffect } from 'react'
import { useFileSystem } from '@/contexts/FileSystemContext'
import { useEditor } from '@/contexts/EditorContext'
import { Segment, FileContent } from '../../types/transcript'

const Editor: React.FC = () => {
  const { selectedItems, files } = useFileSystem()
  const { content, setContent, highlights } = useEditor()

  useEffect(() => {
    const selectedFiles = selectedItems
      .map(id => files[id])
      .filter(file => file.type === 'file' || file.type === 'image')

    const mergedContent: FileContent[] = selectedFiles.map(file => JSON.parse(file.content))

    setContent(mergedContent)
  }, [selectedItems, files, setContent])

  const renderSegment = (segment: Segment, index: number, fileIndex: number) => {
    const isHighlighted = highlights.some(h => h.segmentId === segment.segment_id)
    const highlightClass = isHighlighted 
      ? (highlights.find(h => h.segmentId === segment.segment_id)?.type === 'red' ? 'bg-red-200' : 'bg-green-200') 
      : ''

    return (
      <div key={`${fileIndex}-${segment.segment_id}`} className="mb-4" data-segment-id={segment.segment_id}>
        <div className="text-gray-500 text-xs">{index + 1}</div>
        <div className={`pl-4 ${highlightClass}`}>
          <div className="font-bold">{segment.speaker}</div>
          <div>{segment.text}</div>
          <div className="text-gray-400 text-xs">
            {formatTime(segment.start_time)} - {formatTime(segment.end_time)}
          </div>
        </div>
      </div>
    )
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
          {file.processed_data.transcript.segments.map((segment: Segment, segmentIndex: number) => 
            renderSegment(segment, segmentIndex, fileIndex)
          )}
        </div>
      ))}
    </div>
  )
}

export default Editor