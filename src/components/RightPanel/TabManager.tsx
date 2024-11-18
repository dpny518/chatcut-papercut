// src/components/RightPanel/TabManager.tsx
import React from 'react'
import { useRightPanel } from '@/contexts/RightPanelContext'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const TabManager: React.FC = () => {
  const { tabs, activeTabId, addTab, setActiveTab } = useRightPanel()

  return (
    <Tabs value={activeTabId} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center border-b">
        <TabsList className="flex-grow">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex-shrink-0">
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button variant="ghost" size="icon" onClick={addTab} className="ml-2">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </Tabs>
  )
}

export default TabManager