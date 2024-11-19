// src/components/CenterPanel.tsx
"use client";

import React, { useState } from 'react'
import Editor from './CenterPanel/Editor'
import Toolbar from './CenterPanel/Toolbar'
import { HighlightType } from '@/contexts/HighlightContext'

type Mode = 'copy' | HighlightType;

export default function CenterPanel() {
  const [activeMode, setActiveMode] = useState<Mode>('copy')

  const toggleMode = (mode: Mode) => {
    setActiveMode(prevMode => prevMode === mode ? 'copy' : mode)
  }

  return (
    <div className="h-full flex flex-col">
      <Toolbar activeMode={activeMode} toggleMode={toggleMode} />
      <div className="flex-1 overflow-hidden">
        <Editor activeMode={activeMode} />
      </div>
    </div>
  )
}