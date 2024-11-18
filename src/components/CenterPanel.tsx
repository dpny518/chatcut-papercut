// src/components/CenterPanel.tsx
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Editor from './CenterPanel/Editor'
import { useEditor } from '@/contexts/EditorContext'
import { Segment, FileContent } from '../types/transcript'
import Toolbar from './CenterPanel/Toolbar'


export default function CenterPanel() {
  const { content, highlights, addHighlight, removeHighlight, setCopiedContent } = useEditor()
  const [activeMode, setActiveMode] = useState<'copy' | 'green' | 'red'>('copy')

  const handleAction = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return

    const selectedText = selection.toString()
    const range = selection.getRangeAt(0)
    const startNode = range.startContainer.parentElement
    const endNode = range.endContainer.parentElement

    if (startNode && endNode) {
      const startSegmentId = startNode.closest('[data-segment-id]')?.getAttribute('data-segment-id')
      const endSegmentId = endNode.closest('[data-segment-id]')?.getAttribute('data-segment-id')

      if (startSegmentId && endSegmentId && content.length > 0) {
        const fileContent = content[0] as FileContent

        switch (activeMode) {
          case 'copy':
            const metadata = {
              sourceFile: fileContent.processed_data.media.source,
              sourceSegment: startSegmentId,
              sourceWord: selectedText.split(' ')[0]
            }
            setCopiedContent({ text: selectedText, metadata })
            console.log('Copied:', selectedText, 'Metadata:', metadata)
            break
          case 'green':
          case 'red':
            const segmentsToHighlight = content.flatMap(file => 
              (file as FileContent).processed_data.transcript.segments.filter(segment => 
                segment.segment_id >= startSegmentId && segment.segment_id <= endSegmentId
              )
            )
            segmentsToHighlight.forEach((segment: Segment) => {
              const existingHighlight = highlights.find(h => h.segmentId === segment.segment_id)
              if (existingHighlight && existingHighlight.type === activeMode) {
                removeHighlight(segment.segment_id)
                console.log(`Removed ${activeMode} highlight from segment ${segment.segment_id}`)
              } else {
                addHighlight(segment.segment_id, activeMode)
                console.log(`Added ${activeMode} highlight to segment ${segment.segment_id}`)
              }
            })
            break
        }
      }
    }
  }

  const toggleMode = (mode: 'copy' | 'green' | 'red') => {
    setActiveMode(prevMode => prevMode === mode ? 'copy' : mode)
  }

  return (
    <div className="h-full flex flex-col">
      <Toolbar activeMode={activeMode} toggleMode={toggleMode} />
      <div className="flex-1 overflow-hidden" onMouseUp={handleAction}>
        <Editor />
      </div>
    </div>
  )
}