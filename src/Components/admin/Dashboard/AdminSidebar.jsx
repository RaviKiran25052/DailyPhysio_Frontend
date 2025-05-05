import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaDumbbell, 
  FaUsers, 
  FaUserMd,
  FaTimes
} from 'react-icons/fa';

const AdminSidebar = ({ isOpen, setIsOpen, activeItem }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin/home', id: 'dashboard' },
    { name: 'Exercise Management', icon: <FaDumbbell />, path: '/admin/exercises', id: 'exercises' },
    { name: 'User Management', icon: <FaUsers />, path: '/admin/users', id: 'users' },
    { name: 'Therapist Management', icon: <FaUserMd />, path: '/admin/therapists', id: 'therapists' },
    
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-purple-400">Exercise</span>
          </div>
          <button 
            className="p-1 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <div className="px-2 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm rounded-md transition-colors
                    ${activeItem === item.id || location.pathname === item.path
                      ? 'bg-purple-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-gray-800">
          <div className="flex items-center px-4 py-2 text-sm text-gray-400">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center mr-3">
              <span className="text-white">A</span>
            </div>
            <div>
              <p className="text-white">Admin Portal</p>
              <p className="text-xs">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
