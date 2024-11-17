// src/components/CenterPanel.tsx
'use client'

import React from 'react'
import { Button } from "@/components/ui/button"

export default function CenterPanel() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 mb-4">
        <Button variant="default">Copy</Button>
        <Button variant="destructive">Highlight Red</Button>
        <Button className="bg-green-500 hover:bg-green-600">Highlight Green</Button>
      </div>
      <div className="flex-1">
        <textarea 
          className="w-full h-full p-4 border rounded-md resize-none"
          placeholder="Enter your text here..."
        />
      </div>
    </div>
  )
}