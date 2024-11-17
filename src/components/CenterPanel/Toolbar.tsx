import React from 'react'

const Toolbar: React.FC = () => {
  return (
    <div className="bg-gray-100 p-2">
      {/* Add toolbar buttons here */}
      <button className="px-2 py-1 bg-blue-500 text-white rounded">Copy</button>
      <button className="px-2 py-1 bg-red-500 text-white rounded ml-2">Highlight Red</button>
      <button className="px-2 py-1 bg-green-500 text-white rounded ml-2">Highlight Green</button>
    </div>
  )
}

export default Toolbar