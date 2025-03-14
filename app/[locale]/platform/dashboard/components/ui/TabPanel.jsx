'use client';
import { useState } from 'react';

export default function TabPanel({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs tabs-boxed bg-base-200 mb-4">
        {tabs.map((tab, index) => (
          <a 
            key={index}
            className={`tab ${activeTab === index ? ' bg-green-600 text-white' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
} 