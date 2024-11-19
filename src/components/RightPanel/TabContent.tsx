// src/components/RightPanel/TabContent.tsx

import React, { useState, useEffect, useRef } from 'react'
import { useRightPanel } from '@/contexts/RightPanelContext'
import { useCopy, CopiedWord } from '@/contexts/CopyContext'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ClipboardPaste } from 'lucide-react'
import { TabMetadata } from '@/types/tabTypes'

interface TabContentProps {
  activeTabId: string
}

const TabContent: React.FC<TabContentProps> = ({ activeTabId }) => {
  const { tabs, updateTabContent } = useRightPanel()
  const { copiedContent, setCopiedContent } = useCopy()
  const [cursorPosition, setCursorPosition] = useState<number>(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeTab = tabs.find(tab => tab.id === activeTabId)
  const content = activeTab?.content || ''

  useEffect(() => {
    setCursorPosition(content.length)
  }, [activeTabId, content.length])

  const handleContentChange = (newContent: string) => {
    if (activeTab) {
      updateTabContent(activeTabId, { text: newContent, metadata: activeTab.metadata })
    }
  }

  const handleCursorMove = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    setCursorPosition(textarea.selectionStart)
  }

  const handlePaste = () => {
    console.log('🚀 Paste Button Clicked')
    console.log('Current Copied Content:', copiedContent)
  
    if (copiedContent && activeTab) {
      console.log('✅ Attempting to Paste')
      
      const newContent = content.substring(0, cursorPosition) + copiedContent.text + content.substring(cursorPosition)
      
      const newMetadata: TabMetadata = {
        pastePosition: cursorPosition,
        words: copiedContent.words
      }
  
      console.log('New Content:', newContent)
      console.log('New Metadata:', newMetadata)
  
      const updatedContent = {
        text: newContent,
        metadata: [...activeTab.metadata, newMetadata]
      }
  
      console.log('Updated Content Object:', updatedContent)
  
      updateTabContent(activeTabId, updatedContent)
      setCursorPosition(cursorPosition + copiedContent.text.length)
  
      // Clear the copied content after successful paste
      setCopiedContent(null)
      console.log('Cleared copied content after paste')
    } else {
      console.error('❌ No Copied Content Available or No Active Tab')
    } 
  }
  
  const renderHoverCards = () => {
    let position = 0
    return content.split(' ').map((word, index) => {
      const wordPosition = position
      position += word.length + 1 // +1 for the space
      
      const metadata = activeTab?.metadata.find(m => 
        wordPosition >= m.pastePosition && 
        wordPosition < m.pastePosition + m.words.reduce((acc, w) => acc + w.word.length + 1, 0)
      )
  
      const copiedWord = metadata?.words.find((w, i) => 
        wordPosition >= metadata.pastePosition + metadata.words.slice(0, i).reduce((acc, w) => acc + w.word.length + 1, 0) &&
        wordPosition < metadata.pastePosition + metadata.words.slice(0, i + 1).reduce((acc, w) => acc + w.word.length + 1, 0)
      )
  
      return (
        <HoverCard key={`${index}-${wordPosition}-${word}`}>
          <HoverCardTrigger asChild>
            <span className="cursor-pointer underline">{word}</span>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm font-medium">Word: {word}</p>
              <p className="text-sm">Position: {wordPosition}</p>
              {copiedWord && (
                <>
                  <p className="text-sm">Source File: {copiedWord.sourceFile}</p>
                  <p className="text-sm">Source Segment Index: {copiedWord.sourceSegmentIndex}</p>
                  <p className="text-sm">Source Word Index: {copiedWord.sourceWordIndex}</p>
                </>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
      )
    })
  }

  return (
    <div className="p-4 flex-1 overflow-auto">
      <div className="flex space-x-2 mb-2">
        <Button onClick={handlePaste} disabled={!copiedContent}>
          <ClipboardPaste className="mr-2 h-4 w-4" /> Paste
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        className="w-full h-full min-h-[200px] resize-none focus:ring-2 focus:ring-blue-500"
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyUp={handleCursorMove}
        onClick={handleCursorMove}
      />
      <div className="mt-4">
        <p>Cursor position: {cursorPosition}</p>
        <div className="mt-2">{renderHoverCards()}</div>
      </div>
    </div>
  )
}

export default TabContent