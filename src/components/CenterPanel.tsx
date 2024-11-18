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
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
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
      <div className="flex-1 overflow-hidden">
        <Editor />
      </div>
    </div>
  )
}