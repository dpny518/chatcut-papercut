// src/contexts/FileSystemContext.tsx
'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type FileType = 'folder' | 'file' | 'image'

export interface FileSystemItem {
  id: string
  name: string
  type: FileType
  parentId: string | null
  order: number
  content: string
}

interface FileSystemContextType {
  files: { [id: string]: FileSystemItem }
  selectedItems: string[]
  addFile: (file: File, parentId: string | null) => Promise<void>
  createFolder: (name: string, parentId: string | null) => void
  moveItem: (itemId: string, newParentId: string | null, beforeId: string | null) => void
  deleteItem: (itemId: string) => void
  renameItem: (itemId: string, newName: string) => void
  toggleItemSelection: (itemId: string) => void
  updateFileContent: (fileId: string, newContent: string) => void
  logStructure: () => void
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<{ [id: string]: FileSystemItem }>({})
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Helper to get sorted items in a directory
  const getDirectoryItems = (parentId: string | null) => {
    return Object.values(files)
      .filter(file => file.parentId === parentId)
      .sort((a, b) => a.order - b.order)
  }

  // Helper to generate a new order value between two items
  const generateOrder = (beforeItem: FileSystemItem | null, afterItem: FileSystemItem | null) => {
    const beforeOrder = beforeItem?.order ?? 0
    const afterOrder = afterItem?.order ?? beforeOrder + 1000
    return beforeOrder + (afterOrder - beforeOrder) / 2
  }

  const readFileContent = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target?.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })
  }, [])

  const addFile = useCallback(async (file: File, parentId: string | null) => {
    const id = Math.random().toString(36).substr(2, 9)
    const content = await readFileContent(file)
    
    setFiles(prev => {
      const directoryItems = getDirectoryItems(parentId)
      const lastItem = directoryItems[directoryItems.length - 1]
      const order = lastItem ? lastItem.order + 1000 : 1000

      return {
        ...prev,
        [id]: {
          id,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          parentId,
          order,
          content
        }
      }
    })
  }, [readFileContent])

  const createFolder = useCallback((name: string, parentId: string | null) => {
    const id = Math.random().toString(36).substr(2, 9)
    setFiles(prev => {
      const directoryItems = getDirectoryItems(parentId)
      const lastItem = directoryItems[directoryItems.length - 1]
      const order = lastItem ? lastItem.order + 1000 : 1000

      return {
        ...prev,
        [id]: { id, name, type: 'folder', parentId, order, content: '' }
      }
    })
  }, [])


  const moveItem = useCallback((itemId: string, newParentId: string | null, beforeId: string | null) => {
    setFiles(prev => {
      const newFiles = { ...prev }
      const item = newFiles[itemId]
      if (!item) return prev

      const directoryItems = getDirectoryItems(newParentId)
      let newOrder: number

      if (beforeId === null) {
        // Moving to the end
        const lastItem = directoryItems[directoryItems.length - 1]
        newOrder = lastItem ? lastItem.order + 1000 : 1000
      } else {
        // Moving before a specific item
        const beforeIndex = directoryItems.findIndex(item => item.id === beforeId)
        const beforeItem = beforeIndex >= 0 ? directoryItems[beforeIndex] : null
        const afterItem = beforeIndex > 0 ? directoryItems[beforeIndex - 1] : null
        newOrder = generateOrder(afterItem, beforeItem)
      }

      newFiles[itemId] = {
        ...item,
        parentId: newParentId,
        order: newOrder
      }

      return newFiles
    })
  }, [])

  const deleteItem = useCallback((itemId: string) => {
    setFiles(prev => {
      const newFiles = { ...prev }
      const itemsToDelete = new Set<string>()

      // Recursively collect items to delete
      const collectItems = (id: string) => {
        itemsToDelete.add(id)
        Object.values(newFiles)
          .filter(file => file.parentId === id)
          .forEach(file => collectItems(file.id))
      }

      collectItems(itemId)
      itemsToDelete.forEach(id => delete newFiles[id])

      return newFiles
    })
    setSelectedItems(prev => prev.filter(id => id !== itemId))
  }, [])

  const renameItem = useCallback((itemId: string, newName: string) => {
    setFiles(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], name: newName }
    }))
  }, [])

  const toggleItemSelection = useCallback((itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }, [])

  const updateFileContent = useCallback((fileId: string, newContent: string) => {
    setFiles(prev => ({
      ...prev,
      [fileId]: { ...prev[fileId], content: newContent }
    }))
  }, [])


  const logStructure = useCallback(() => {
    const printStructure = (parentId: string | null, depth = 0) => {
      const items = getDirectoryItems(parentId)
      items.forEach(item => {
        console.log(`${'  '.repeat(depth)}${item.name} (${item.type})`)
        if (item.type === 'folder') {
          printStructure(item.id, depth + 1)
        }
      })
    }

    console.log('File Structure:')
    printStructure(null)
  }, [files])


  const contextValue: FileSystemContextType = {
    files,
    selectedItems,
    addFile,
    createFolder,
    moveItem,
    deleteItem,
    renameItem,
    toggleItemSelection,
    updateFileContent,
    logStructure
  }

  return (
    <FileSystemContext.Provider value={contextValue}>
      {children}
    </FileSystemContext.Provider>
  )
}

export const useFileSystem = () => {
  const context = useContext(FileSystemContext)
  if (!context) throw new Error('useFileSystem must be used within FileSystemProvider')
  return context
}