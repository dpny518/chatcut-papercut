// RightPanel.tsx
'use client'

import React, { useState } from 'react'
import TabManager from './RightPanel/TabManager'
import TabContent from './RightPanel/TabContent'

// Client component with state
export const RightPanel = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <TabManager activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto p-4">
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  )
}

// Server component wrapper
export const RightPanelContainer = () => {
  return <RightPanel />
}