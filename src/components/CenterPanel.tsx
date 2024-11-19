'use client'

import React, { useState } from 'react'
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

  const findFirstWordSpan = (node: Node | null): HTMLElement | null => {
    if (!node) return null
    
    // If this node is a word-span, return it
    if (node instanceof HTMLElement && node.classList.contains('word-span')) {
      return node
    }
    
    // If this is an element, search its children
    if (node instanceof HTMLElement) {
      // Get all word-spans within this element
      const wordSpans = node.getElementsByClassName('word-span')
      if (wordSpans.length > 0) {
        return wordSpans[0] as HTMLElement
      }
    }
    
    return null
  }

  const findClosestWordSpan = (node: Node, isStart: boolean): HTMLElement | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode!;
    }
  
    if (node instanceof HTMLElement) {
      if (node.classList.contains('word-span')) {
        return node;
      }
  
      const wordSpans = node.getElementsByClassName('word-span');
      if (wordSpans.length > 0) {
        return isStart ? wordSpans[0] as HTMLElement : wordSpans[wordSpans.length - 1] as HTMLElement;
      }
    }
  
    return null;
  };
  
  const handleAction = (event: React.MouseEvent) => {
    console.log('🚀 Mouse Up Event Triggered');
    console.log('Current Active Mode:', activeMode);
  
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      console.log('No selection or selection is collapsed');
      return;
    }
  
    console.log('Selection:', selection.toString());
  
    const range = selection.getRangeAt(0);
    
    // Find all word spans within the selection
    const container = range.commonAncestorContainer as HTMLElement;
    const allWordSpans = Array.from(container.querySelectorAll('.word-span'));
    
    const selectedSpans = allWordSpans.filter(span => range.intersectsNode(span)) as HTMLElement[];
  
    console.log('Selected Spans:', selectedSpans);
  
    if (selectedSpans.length > 0) {
      const startWordSpan = selectedSpans[0];
      const endWordSpan = selectedSpans[selectedSpans.length - 1];
  
      const startFileId = startWordSpan.getAttribute('data-file-id');
      const startWordIndex = parseInt(startWordSpan.getAttribute('data-word-index') || '0', 10);
      const endFileId = endWordSpan.getAttribute('data-file-id');
      const endWordIndex = parseInt(endWordSpan.getAttribute('data-word-index') || '0', 10);
  
      const selectedText = selectedSpans.map(span => span.textContent?.trim()).join(' ');
  
      console.log('Selected Text from spans:', selectedText);
      console.log('Start File ID:', startFileId);
      console.log('Start Word Index:', startWordIndex);
      console.log('End Word Index:', endWordIndex);
  
      if (startFileId && startFileId === endFileId) {
        switch (activeMode) {
          case 'copy':
            const metadata = {
              sourceFile: startFileId,
              startSegment: startWordIndex.toString(),
              endSegment: endWordIndex.toString(),
              startWord: startWordIndex,
              endWord: endWordIndex
            };
            setCopiedContent({ text: selectedText, metadata });
            console.log('📋 Copied:', selectedText);
            console.log('📋 Metadata:', metadata);
            break;
            
          case 'green':
          case 'red':
            const highlight: Highlight = {
              fileId: startFileId,
              segmentId: startWordIndex.toString(),
              startWordIndex: startWordIndex,
              endWordIndex: endWordIndex,
              text: selectedText,
              type: activeMode
            }
            
            // Check if the highlight already exists
            const existingHighlight = activeMode === 'green' 
              ? greenHighlights.find(h => 
                  h.fileId === startFileId && 
                  h.startWordIndex === startWordIndex && 
                  h.endWordIndex === endWordIndex)
              : redHighlights.find(h => 
                  h.fileId === startFileId && 
                  h.startWordIndex === startWordIndex && 
                  h.endWordIndex === endWordIndex)
  
            if (existingHighlight) {
              // Remove the existing highlight
              if (activeMode === 'green') {
                removeGreenHighlight(startFileId, startWordIndex.toString(), startWordIndex, endWordIndex)
              } else {
                removeRedHighlight(startFileId, startWordIndex.toString(), startWordIndex, endWordIndex)
              }
              console.log(`Removed ${activeMode} highlight from words ${startWordIndex}-${endWordIndex}`)
            } else {
              // Add the new highlight
              if (activeMode === 'green') {
                addGreenHighlight(highlight)
              } else {
                addRedHighlight(highlight)
              }
              console.log(`Added ${activeMode} highlight to words ${startWordIndex}-${endWordIndex}`, highlight)
            }
            break;
        }
      } else {
        console.log('❌ Selection spans multiple files or no file ID found');
      }
    } else {
      console.log('❌ No word spans found in the selection');
    }
  }

  const findWordSpanFromNode = (node: Node): HTMLElement | null => {
    while (node && node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode!
    }
  
    if (node instanceof HTMLElement) {
      return node.closest('.word-span')
    }
  
    return null
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