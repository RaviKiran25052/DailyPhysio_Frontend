import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaBell, FaBars, FaSearch } from 'react-icons/fa';

const AdminHeader = ({ adminInfo, handleLogout, toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Mock notifications
  const notifications = [
    { id: 1, message: 'New user registered', time: '10 minutes ago', read: false },
    { id: 2, message: 'System update completed', time: '1 hour ago', read: false },
    { id: 3, message: 'New exercise added by therapist', time: '3 hours ago', read: true },
    { id: 4, message: 'Weekly report generated', time: '1 day ago', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-gray-800 shadow-md z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="text-gray-400 focus:outline-none focus:text-purple-400 md:hidden"
          >
            <FaBars className="h-5 w-5" />
          </button>
          <Link to="/admin/home" className="ml-4 md:ml-0">
            <h1 className="text-xl font-bold text-purple-400">Hep2Go Admin</h1>
          </Link>
        </div>

        <div className="hidden md:flex md:flex-1 md:justify-center px-2 lg:ml-6 lg:justify-end">
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1 text-gray-300 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 relative"
            >
              <FaBell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1 divide-y divide-gray-700">
                  <div className="px-4 py-2 bg-gray-700 text-sm font-medium text-gray-200 flex justify-between items-center">
                    <span>Notifications</span>
                    <button className="text-purple-400 text-xs hover:text-purple-300">
                      Mark all as read
                    </button>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`px-4 py-3 hover:bg-gray-700 ${!notification.read ? 'bg-gray-700' : ''}`}
                      >
                        <p className="text-sm text-gray-300">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400">
                      No new notifications
                    </div>
                  )}
                  <div className="px-4 py-2 text-center">
                    <Link to="/admin/notifications" className="text-sm text-purple-400 hover:text-purple-300">
                      View all notifications
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ml-4 relative flex items-center">
            {adminInfo && (
              <div className="flex items-center">
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-gray-300 mr-2">
                    {adminInfo.fullName}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                  {adminInfo.fullName ? adminInfo.fullName.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="ml-4 px-3 py-1 text-sm text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 flex items-center"
            >
              <FaSignOutAlt className="mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
