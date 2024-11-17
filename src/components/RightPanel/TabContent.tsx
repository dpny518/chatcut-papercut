import React from 'react'

interface TabContentProps {
  activeTab: number
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  return (
    <div className="p-4 flex-1 overflow-auto">
      {activeTab === 0 && <div>Content for Tab 1</div>}
      {activeTab === 1 && <div>Content for Tab 2</div>}
      {activeTab === 2 && <div>Content for Tab 3</div>}
    </div>
  )
}

export default TabContent