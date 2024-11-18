// src/components/CenterPanel.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import Editor from './CenterPanel/Editor'
import { useEditor } from '@/contexts/EditorContext'
import { useRightPanel } from '@/contexts/RightPanelContext'
import { Segment, FileContent } from '../types/transcript'

export default function CenterPanel() {
  const { content, highlights, addHighlight, removeHighlight, setCopiedText } = useEditor()
  const { pasteContent } = useRightPanel()

  const handleCopy = () => {
    console.log('Copy button clicked')
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed) {
      const selectedText = selection.toString()
      console.log('Selected text:', selectedText)
      const range = selection.getRangeAt(0)
      const startNode = range.startContainer.parentElement
      const endNode = range.endContainer.parentElement

      if (startNode && endNode) {
        const startSegmentId = startNode.closest('[data-segment-id]')?.getAttribute('data-segment-id')
        const endSegmentId = endNode.closest('[data-segment-id]')?.getAttribute('data-segment-id')
        console.log(`Start segment: ${startSegmentId}, End segment: ${endSegmentId}`)

        if (startSegmentId && endSegmentId && content.length > 0) {
          const fileContent = content[0] as FileContent
          const metadata = {
            sourceFile: fileContent.processed_data.media.source,
            sourceSegment: startSegmentId,
            sourceWord: selectedText.split(' ')[0]
          }
          console.log('Metadata:', metadata)
          setCopiedText(selectedText)
          pasteContent(selectedText, metadata)
        }
      }
    }
  }

  const handleHighlight = (type: 'red' | 'green') => {
    console.log(`Highlight ${type} button clicked`)
    const selection = window.getSelection()
    if (!selection) return

    const range = selection.getRangeAt(0)
    const startNode = range.startContainer.parentElement
    const endNode = range.endContainer.parentElement

    if (startNode && endNode) {
      const startSegmentId = startNode.closest('[data-segment-id]')?.getAttribute('data-segment-id')
      const endSegmentId = endNode.closest('[data-segment-id]')?.getAttribute('data-segment-id')
      console.log(`Start segment: ${startSegmentId}, End segment: ${endSegmentId}`)

      if (startSegmentId && endSegmentId) {
        const segmentsToHighlight = content.flatMap(file => 
          (file as FileContent).processed_data.transcript.segments.filter(segment => 
            segment.segment_id >= startSegmentId && segment.segment_id <= endSegmentId
          )
        )
        console.log('Segments to highlight:', segmentsToHighlight)

        segmentsToHighlight.forEach((segment: Segment) => {
          const existingHighlight = highlights.find(h => h.segmentId === segment.segment_id)
          if (existingHighlight && existingHighlight.type === type) {
            console.log(`Removing highlight from segment ${segment.segment_id}`)
            removeHighlight(segment.segment_id)
          } else {
            console.log(`Adding ${type} highlight to segment ${segment.segment_id}`)
            addHighlight(segment.segment_id, type)
          }
        })
      }
    }
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
        <Button variant="default" size="sm" onClick={handleCopy}>Copy</Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => handleHighlight('red')}
          className={highlights.some(h => h.type === 'red') ? 'opacity-50' : ''}
        >
          Highlight Red
        </Button>
        <Button 
          variant="default"
          size="sm" 
          className={`bg-green-500 hover:bg-green-600 text-white ${highlights.some(h => h.type === 'green') ? 'opacity-50' : ''}`}
          onClick={() => handleHighlight('green')}
        >
          Highlight Green
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor />
      </div>
    </div>
  )
}