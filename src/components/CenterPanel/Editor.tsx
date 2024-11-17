import React from 'react'

const Editor: React.FC = () => {
  return (
    <div className="flex-1 p-4 overflow-auto">
      <textarea 
        className="w-full h-full p-2 border rounded resize-none"
        placeholder="Enter your text here..."
      />
    </div>
  )
}

export default Editor