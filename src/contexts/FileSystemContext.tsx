// src/contexts/FileSystemContext.tsx
'use client'

import React, { createContext, useContext, useState } from 'react'

// Types (you can also move these to src/types/fileSystem.ts)
export type FileType = 'folder' | 'file' | 'image'

export type FileSystemItem = {
  id: string
  name: string
  type: FileType
  children?: FileSystemItem[]
}

type FileSystemContextType = {
  files: FileSystemItem[]
  addFile: (file: FileSystemItem, parentId?: string) => void
  createFolder: (name: string, parentId?: string) => void
}

export const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileSystemItem[]>([])

  const addFile = (file: FileSystemItem, parentId?: string) => {
    if (!parentId) {
      setFiles(prev => [...prev, file])
      return
    }

    setFiles(prev => {
      const updateChildren = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map(item => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), file]
            }
          }
          if (item.children) {
            return {
              ...item,
              children: updateChildren(item.children)
            }
          }
          return item
        })
      }
      return updateChildren(prev)
    })
  }

  const createFolder = (name: string, parentId?: string) => {
    const newFolder: FileSystemItem = {
      id: Math.random().toString(36).slice(2),
      name,
      type: 'folder',
      children: []
    }
    addFile(newFolder, parentId)
  }

  return (
    <FileSystemContext.Provider value={{ files, addFile, createFolder }}>
      {children}
    </FileSystemContext.Provider>
  )
}

export const useFileSystem = () => {
  const context = useContext(FileSystemContext)
  if (!context) throw new Error('useFileSystem must be used within FileSystemProvider')
  return context
}