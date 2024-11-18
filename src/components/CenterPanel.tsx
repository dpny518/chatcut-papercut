// src/components/CenterPanel.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import Editor from './CenterPanel/Editor'

export default function CenterPanel() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="default" size="sm" className="text-sm">Copy</Button>
        <Button variant="destructive" size="sm" className="text-sm">Highlight Red</Button>
        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-sm">Highlight Green</Button>
      </div>
      <Editor />
    </div>
  )
}