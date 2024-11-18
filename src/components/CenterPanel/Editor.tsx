// src/components/CenterPanel/Editor.tsx
'use client'

import React, { useEffect } from 'react'
import { useFileSystem } from '@/contexts/FileSystemContext'
import { useEditor } from '@/contexts/EditorContext'
import { useGreenHighlight, useRedHighlight } from '@/contexts/HighlightContext'
import { Segment, FileContent } from '../../types/transcript'

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

  const renderContent = (file: FileContent, fileIndex: number) => {
    let currentSpeaker = ''
    let paragraphSegments: Segment[] = []
    let paragraphIndex = 0

    const renderParagraph = (segments: Segment[], index: number) => {
      const greenHighlight = greenHighlights.find(h => h.segmentId === segments[0].segment_id)
      const redHighlight = redHighlights.find(h => h.segmentId === segments[0].segment_id)
      const highlightClass = greenHighlight ? 'bg-green-200' : (redHighlight ? 'bg-red-200' : '')

      const paragraphKey = `paragraph-${fileIndex}-${index}-${segments[0].text.slice(0, 10)}`

      return (
        <div 
          key={paragraphKey}
          className={`mb-4 ${highlightClass} flex`}
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
              {segments.map((segment, segIndex) => {
                const segmentKey = `${paragraphKey}-seg-${segIndex}-${segment.text.slice(0, 5)}`
                return (
                  <span 
                    key={segmentKey} 
                    data-segment-id={segment.segment_id}
                  >
                    {segment.text}{' '}
                  </span>
                )
              })}
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