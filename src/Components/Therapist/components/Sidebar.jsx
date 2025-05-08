import React from 'react';
import { RiDashboardLine, RiUserLine, RiFileListLine, RiRunLine } from 'react-icons/ri';

const Sidebar = ({ tab, setTab }) => {
  const menuItems = [
    { id: 'main', label: 'Dashboard', icon: <RiDashboardLine size={20} /> },
    { id: 'consultation', label: 'Consultation', icon: <RiFileListLine size={20} /> },
    { id: 'exercise', label: 'Exercise Management', icon: <RiRunLine size={20} /> },
    { id: 'user', label: 'User Management', icon: <RiUserLine size={20} /> },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-8">
          <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 2L12 7L7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 7V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-bold">ExerciseMD</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                tab === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 