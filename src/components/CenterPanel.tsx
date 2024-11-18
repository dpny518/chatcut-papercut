// src/components/CenterPanel.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import Editor from './CenterPanel/Editor'

export default function CenterPanel() {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="default" size="sm">Copy</Button>
        <Button variant="destructive" size="sm">Highlight Red</Button>
        <Button 
          variant="default"
          size="sm" 
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Highlight Green
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-auto border rounded-md">
          <textarea 
            className="w-full h-full p-4 resize-none focus:outline-none"
            placeholder="Select files to edit"
          />
        </div>
      </div>
    </div>
  )
}