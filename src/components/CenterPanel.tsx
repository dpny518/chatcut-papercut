// src/components/CenterPanel.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Editor from './CenterPanel/Editor'
import { useEditor } from '@/contexts/EditorContext'
import { useGreenHighlight, useRedHighlight, HighlightType, Highlight } from '@/contexts/HighlightContext'
import { useCopy } from '@/contexts/CopyContext'
import { Segment, FileContent } from '../types/transcript'
import Toolbar from './CenterPanel/Toolbar'

type Mode = 'copy' | HighlightType;

export default function CenterPanel() {
  const { content } = useEditor()
  const { highlights: greenHighlights, addHighlight: addGreenHighlight, removeHighlight: removeGreenHighlight } = useGreenHighlight()
  const { highlights: redHighlights, addHighlight: addRedHighlight, removeHighlight: removeRedHighlight } = useRedHighlight()
  const { copiedContent, setCopiedContent } = useCopy()
  const [activeMode, setActiveMode] = useState<Mode>('copy')

  useEffect(() => {
    if (copiedContent) {
      console.log('🔍 Copied Content Updated:', {
        text: copiedContent.text,
        metadata: copiedContent.metadata
      });
    }
  }, [copiedContent])

  const handleAction = (event: React.MouseEvent) => {
    console.log('🚀 Mouse Up Event Triggered');
    console.log('Current Active Mode:', activeMode);

    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      console.log('No selection or selection is collapsed');
      return;
    }

    console.log('Selection:', selection.toString());

    const range = selection.getRangeAt(0)
    const startNode = range.startContainer.parentElement
    const endNode = range.endContainer.parentElement

    console.log('Start Node:', startNode);
    console.log('End Node:', endNode);

    if (startNode && endNode) {
      const startWordSpan = startNode.closest('.word-span')
      const endWordSpan = endNode.closest('.word-span')

      console.log('Start Word Span:', startWordSpan);
      console.log('End Word Span:', endWordSpan);

      if (startWordSpan && endWordSpan) {
        const startFileId = startWordSpan.getAttribute('data-file-id')
        const startSegmentIndex = startWordSpan.getAttribute('data-segment-index')
        const startWordIndex = parseInt(startWordSpan.getAttribute('data-word-index') || '0', 10)

        const endFileId = endWordSpan.getAttribute('data-file-id')
        const endSegmentIndex = endWordSpan.getAttribute('data-segment-index')
        const endWordIndex = parseInt(endWordSpan.getAttribute('data-word-index') || '0', 10)

        const selectedText = selection.toString()

        console.log('Selected Text:', selectedText);
        console.log('Start File ID:', startFileId);
        console.log('Start Segment Index:', startSegmentIndex);
        console.log('Start Word Index:', startWordIndex);
        console.log('End File ID:', endFileId);
        console.log('End Segment Index:', endSegmentIndex);
        console.log('End Word Index:', endWordIndex);

        if (startFileId && startSegmentIndex && endFileId && endSegmentIndex) {
          switch (activeMode) {
            case 'copy':
              const metadata = {
                sourceFile: startFileId,
                startSegment: startSegmentIndex,
                endSegment: endSegmentIndex,
                startWord: startWordIndex,
                endWord: endWordIndex
              }
              setCopiedContent({ text: selectedText, metadata })
              console.log('📋 Copied:', selectedText);
              console.log('📋 Metadata:', metadata);
              break;
            case 'green':
            case 'red':
              const highlight: Highlight = {
                fileId: startFileId,
                segmentId: startSegmentIndex,
                startWordIndex: startWordIndex,
                endWordIndex: endWordIndex,
                text: selectedText,
                type: activeMode
              }
              
              // Check if the highlight already exists
              const existingHighlight = activeMode === 'green' 
                ? greenHighlights.find(h => h.fileId === startFileId && h.segmentId === startSegmentIndex &&
                    h.startWordIndex === startWordIndex && h.endWordIndex === endWordIndex)
                : redHighlights.find(h => h.fileId === startFileId && h.segmentId === startSegmentIndex &&
                    h.startWordIndex === startWordIndex && h.endWordIndex === endWordIndex)

              if (existingHighlight) {
                // Remove the existing highlight
                if (activeMode === 'green') {
                  removeGreenHighlight(startFileId, startSegmentIndex, startWordIndex, endWordIndex)
                } else {
                  removeRedHighlight(startFileId, startSegmentIndex, startWordIndex, endWordIndex)
                }
                console.log(`Removed ${activeMode} highlight from segment ${startSegmentIndex}`)
              } else {
                // Add the new highlight
                if (activeMode === 'green') {
                  addGreenHighlight(highlight)
                } else {
                  addRedHighlight(highlight)
                }
                console.log(`Added ${activeMode} highlight to segment ${startSegmentIndex}`, highlight)
              }
              break;
          }
        }
      } else {
        console.log('❌ Could not find word spans for the selection');
        console.log('Start Node classList:', startNode.classList);
        console.log('End Node classList:', endNode.classList);
        console.log('Start Node parent:', startNode.parentElement);
        console.log('End Node parent:', endNode.parentElement);
      }
    } else {
      console.log('❌ Start or end node is null');
    }
  }

  const toggleMode = (mode: Mode) => {
    setActiveMode(prevMode => prevMode === mode ? 'copy' : mode)
  }

  return (
    <div className="h-full flex flex-col">
      <Toolbar activeMode={activeMode} toggleMode={toggleMode} />
      <div 
        className="flex-1 overflow-hidden" 
        onMouseUp={handleAction}
        onClick={(e) => console.log('Click Event on Container')}
        onSelect={(e) => console.log('Select Event on Container')}
      >
        <Editor />
      </div>
    </div>
  )
}