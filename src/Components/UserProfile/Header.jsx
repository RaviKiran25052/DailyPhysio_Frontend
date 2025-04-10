import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser } from 'react-icons/fi';

const Header = ({ userData }) => {
  return (
    <header className="bg-gradient-to-r from-gray-900 to-purple-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                ExerciseMD
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link 
                to="/exercises" 
                className="px-3 py-2 text-sm font-medium text-white hover:text-purple-300 transition-colors"
              >
                Exercises
              </Link>
              <Link 
                to="/profile" 
                className="px-3 py-2 text-sm font-medium text-white bg-purple-800 rounded-md"
              >
                My Stuff
              </Link>
            </div>
          </div>

          {/* Search and User Options */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full md:w-48 pl-8 pr-4 py-1 text-sm bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-full">
                <span className="sr-only">Open user menu</span>
                {userData.avatar ? (
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src={userData.avatar} 
                    alt={userData.name} 
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                    <FiUser />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 