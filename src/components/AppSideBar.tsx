'use client'

import React from 'react'
import { File, Folder, FileText, FileImage } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Define a type for our file system items
type FileSystemItem = {
  name: string
  type: 'folder' | 'pdf' | 'doc' | 'txt' | 'image'
  children?: FileSystemItem[]
}

// Sample file system structure
const fileSystem: FileSystemItem[] = [
  {
    name: 'Documents',
    type: 'folder',
    children: [
      { name: 'Report.pdf', type: 'pdf' },
      { name: 'Presentation.doc', type: 'doc' },
      { name: 'Notes.txt', type: 'txt' },
    ],
  },
  {
    name: 'Images',
    type: 'folder',
    children: [
      { name: 'Photo.jpg', type: 'image' },
      { name: 'Screenshot.png', type: 'image' },
    ],
  },
  { name: 'README.txt', type: 'txt' },
]

// Helper function to render file icon
const FileIcon: React.FC<{ type: FileSystemItem['type'] }> = ({ type }) => {
  switch (type) {
    case 'folder':
      return <Folder className="mr-2" />
    case 'pdf':
      return <File className="mr-2" />
    case 'doc':
      return <FileText className="mr-2" />
    case 'txt':
      return <FileText className="mr-2" />
    case 'image':
      return <FileImage className="mr-2" />
    default:
      return <File className="mr-2" />
  }
}

// Recursive component to render file system structure
const FileSystemNode: React.FC<{ item: FileSystemItem }> = ({ item }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton>
        <FileIcon type={item.type} />
        <span>{item.name}</span>
      </SidebarMenuButton>
      {item.children && (
        <SidebarMenu>
          {item.children.map((child, index) => (
            <FileSystemNode key={index} item={child} />
          ))}
        </SidebarMenu>
      )}
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>File System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fileSystem.map((item, index) => (
                <FileSystemNode key={index} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}