// src/components/RightPanel.tsx
'use client'

import React from 'react'
import { useRightPanel } from '@/contexts/RightPanelContext'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import TabManager from './RightPanel/TabManager'
import TabContent from './RightPanel/TabContent'
import { Tab } from '@/types/tabTypes'

export const RightPanel: React.FC = () => {
  const { tabs, activeTabId } = useRightPanel()

  return (
    <div className="h-full flex flex-col p-4">
      <TabManager />
      <Tabs value={activeTabId} className="flex-1 flex flex-col mt-4">
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="flex-1 overflow-auto">
            <TabContent activeTabId={tab.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}