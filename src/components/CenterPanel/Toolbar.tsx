// src/components/CenterPanel/Toolbar.tsx
import React from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"  // Make sure you have this utility function
import { HighlightType } from '@/contexts/HighlightContext'

interface ToolbarProps {
  activeMode: 'copy' | HighlightType
  toggleMode: (mode: 'copy' | HighlightType) => void
}

const Toolbar: React.FC<ToolbarProps> = ({ activeMode, toggleMode }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => toggleMode('copy')}
        className={cn(
          "border-2 border-black",
          activeMode === 'copy' && "bg-black text-white"
        )}
      >
        Copy
      </Button>
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => toggleMode('red')}
        className={cn(
          "border-2 border-red-500",
          activeMode === 'red' && "bg-red-500 text-white"
        )}
      >
        Highlight Red
      </Button>
      <Button 
        variant="outline"
        size="sm" 
        onClick={() => toggleMode('green')}
        className={cn(
          "border-2 border-green-500",
          activeMode === 'green' && "bg-green-500 text-white"
        )}
      >
        Highlight Green
      </Button>
    </div>
  )
}

export default Toolbar