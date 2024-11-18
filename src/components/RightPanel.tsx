// src/components/RightPanel.tsx
'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RightPanelContainer() {
  const [activeTab, setActiveTab] = useState("tab1")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <TabsList className="flex justify-start overflow-x-auto">
        <TabsTrigger value="tab1" className="flex-shrink-0">Editor</TabsTrigger>
        <TabsTrigger value="tab2" className="flex-shrink-0">Preview</TabsTrigger>
        <TabsTrigger value="tab3" className="flex-shrink-0">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="flex-1 overflow-auto">
        <textarea 
          className="w-full h-full p-4 border-0 resize-none focus:outline-none"
          placeholder="Enter your text here..."
        />
      </TabsContent>
      <TabsContent value="tab2" className="flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <p>Your rendered content will appear here.</p>
        </div>
      </TabsContent>
      <TabsContent value="tab3" className="flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <p>Editor settings and options will be displayed here.</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}