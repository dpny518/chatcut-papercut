// src/components/AppSidebar.tsx
'use client'

import React, { useState } from 'react'
import { File, Folder, FileText, FileImage, Upload, Plus } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFileSystem, FileType, FileSystemItem } from '@/contexts/FileSystemContext'


// File icon component
const FileIcon: React.FC<{ type: FileType }> = ({ type }) => {
  switch (type) {
    case 'folder':
      return <Folder className="w-4 h-4" />
    case 'image':
      return <FileImage className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

// FileSystemTree component updated for your layout
const FileSystemTree: React.FC<{ items: FileSystemItem[], level?: number }> = ({ items, level = 0 }) => {
  const { createFolder } = useFileSystem()
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)

  const handleCreateFolder = (parentId?: string) => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), parentId)
      setNewFolderName('')
      setShowNewFolderInput(false)
    }
  }

  return (
    <div className="pl-2">
      {items.map((item) => (
        <div key={item.id} className="py-1">
          <div className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer">
            <FileIcon type={item.type} />
            <span className="text-sm truncate">{item.name}</span>
          </div>
          {item.children && <FileSystemTree items={item.children} level={level + 1} />}
        </div>
      ))}
      <div className="mt-2 px-2">
        {showNewFolderInput ? (
          <div className="flex gap-2">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="h-8 text-sm"
            />
            <Button 
              size="sm" 
              className="h-8 px-2"
              onClick={() => handleCreateFolder()}
            >
              Create
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 h-8 px-2 w-full justify-start"
            onClick={() => setShowNewFolderInput(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">New Folder</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export function AppSidebar() {
  const { files, addFile } = useFileSystem()
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles) return

    Array.from(uploadedFiles).forEach(file => {
      const isImage = file.type.startsWith('image/')
      const newFile: FileSystemItem = {
        id: Math.random().toString(36).slice(2),
        name: file.name,
        type: isImage ? 'image' : 'file'
      }
      addFile(newFile)
    })
  }

  return (
    <Sidebar className="w-full h-screen">
      <SidebarContent>
        <SidebarGroup>
          <div className="p-4">
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="flex items-center gap-2 w-full mb-4"
              size="sm"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <FileSystemTree items={files} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}