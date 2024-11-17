'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface File {
  id: string
  name: string
  content: string
}

interface FileSystemContextType {
  files: File[]
  addFile: (file: File) => void
  removeFile: (id: string) => void
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export const FileSystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([])

  const addFile = (file: File) => {
    setFiles(prevFiles => [...prevFiles, file])
  }

  const removeFile = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id))
  }

  return (
    <FileSystemContext.Provider value={{ files, addFile, removeFile }}>
      {children}
    </FileSystemContext.Provider>
  )
}

export const useFileSystem = () => {
  const context = useContext(FileSystemContext)
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider')
  }
  return context
}