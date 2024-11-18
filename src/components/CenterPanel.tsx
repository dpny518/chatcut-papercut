// src/components/CenterPanel.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import Editor from './CenterPanel/Editor'
import { useFileSystem } from '@/contexts/FileSystemContext'

export default function CenterPanel() {
  const { selectedItems } = useFileSystem()

  const handleCopy = () => {
    // Implement copy functionality
  }

  const handleHighlightRed = () => {
    // Implement highlight red functionality
  }

  const handleHighlightGreen = () => {
    // Implement highlight green functionality
  }

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="default" size="sm" onClick={handleCopy}>Copy</Button>
        <Button variant="destructive" size="sm" onClick={handleHighlightRed}>Highlight Red</Button>
        <Button 
          variant="default"
          size="sm" 
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={handleHighlightGreen}
        >
          Highlight Green
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <Editor />
      </div>
    </div>
  )
}