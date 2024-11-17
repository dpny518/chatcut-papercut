// src/components/RightPanel.tsx
'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RightPanelContainer() {
  const [activeTab, setActiveTab] = useState("tab1")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="flex-1">
        <div className="p-4">Content for Tab 1</div>
      </TabsContent>
      <TabsContent value="tab2" className="flex-1">
        <div className="p-4">Content for Tab 2</div>
      </TabsContent>
      <TabsContent value="tab3" className="flex-1">
        <div className="p-4">Content for Tab 3</div>
      </TabsContent>
    </Tabs>
  )
}