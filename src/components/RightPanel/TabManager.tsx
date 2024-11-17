import React from 'react'

interface TabManagerProps {
  activeTab: number
  setActiveTab: (index: number) => void
}

const TabManager: React.FC<TabManagerProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']

  return (
    <div className="flex border-b">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`px-4 py-2 ${activeTab === index ? 'bg-white border-b-2 border-blue-500' : 'bg-gray-100'}`}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default TabManager