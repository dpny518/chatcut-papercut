// src/components/CenterPanel/Editor.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useFileSystem } from '@/contexts/FileSystemContext'

const Editor: React.FC = () => {
  const { selectedItems, files, updateFileContent } = useFileSystem()
  const [mergedContent, setMergedContent] = useState<string>('')

  useEffect(() => {
    const selectedFiles = selectedItems
      .map(id => files[id])
      .filter(file => file.type === 'file' || file.type === 'image')

    const content = selectedFiles
      .map(file => file.content || '')
      .join('\n\n--------\n\n')

    setMergedContent(content)
  }, [selectedItems, files])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setMergedContent(newContent)

    // Split the content and update each file
    const contentParts = newContent.split('\n\n--------\n\n')
    selectedItems.forEach((id, index) => {
      if (files[id].type === 'file' || files[id].type === 'image') {
        updateFileContent(id, contentParts[index] || '')
      }
    })
  }

  return (
    <div className="h-full">
      <textarea 
        className="w-full h-full p-4 border-0 resize-none focus:outline-none"
        placeholder={selectedItems.length > 0 ? "Edit your files here..." : "Select files to edit"}
        value={mergedContent}
        onChange={handleContentChange}
      />
    </div>
  )
}

export default Editor