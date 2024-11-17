'use client'

import React from 'react'
import Toolbar from './CenterPanel/Toolbar'
import Editor from './CenterPanel/Editor'

const CenterPanel = () => {
  return (
    <div className="flex flex-col h-full">
      <Toolbar />
      <div className="flex-1 overflow-auto p-4">
        <Editor />
      </div>
    </div>
  )
}

export default CenterPanel