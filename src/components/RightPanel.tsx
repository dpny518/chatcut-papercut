// src/components/RightPanel.tsx
'use client'

import React, { useState } from 'react'
import { useRightPanel } from '@/contexts/RightPanelContext'
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export const RightPanel: React.FC = () => {
  const { tabs, activeTabId, addTab, renameTab, setActiveTab, cursorPositions } = useRightPanel()
  const [editingTabId, setEditingTabId] = useState<string | null>(null)

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`px-4 py-2 cursor-pointer ${activeTabId === tab.id ? 'bg-gray-200' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {editingTabId === tab.id ? (
              <input
                value={tab.name}
                onChange={(e) => renameTab(tab.id, e.target.value)}
                onBlur={() => setEditingTabId(null)}
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => setEditingTabId(tab.id)}>{tab.name}</span>
            )}
          </div>
        ))}
        <button onClick={addTab}>+</button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {tabs.find(tab => tab.id === activeTabId)?.content.map((item, index) => (
          <HoverCard key={index}>
            <HoverCardTrigger>
              <span>{item.text}</span>
            </HoverCardTrigger>
            <HoverCardContent>
              <p>Source: {item.metadata[0].sourceFile}</p>
              <p>Segment: {item.metadata[0].sourceSegment}</p>
              <p>Word: {item.metadata[0].sourceWord}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
        <span className="animate-pulse">|</span>
      </div>
    </div>
  )
}