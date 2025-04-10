import React, { useState } from 'react';

const ProfileTabs = ({ children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || 0);

  const tabs = React.Children.toArray(children);
  
  return (
    <div className="mb-6">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === index
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-purple-300'
            } transition-colors`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs[activeTab]}
      </div>
    </div>
  );
};

const Tab = ({ children }) => {
  return <div className="tab-pane">{children}</div>;
};

ProfileTabs.Tab = Tab;

export default ProfileTabs; 