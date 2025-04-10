import React, { useState, useEffect } from 'react';
import { Search, X, ArrowLeft, Filter, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ExerciseHeader = ({ searchQuery, setSearchQuery, showFilters, setShowFilters }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    setIsLoggedIn(!!storedUser);
  }, []);
  
  // Handle My Profile click
  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      // If not logged in, open the login modal by navigating to home with a query param
      navigate('/?login=true');
    }
  };
  
  return (
    <header className="bg-gradient-to-r from-gray-900 via-purple-900/40 to-gray-900 py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <button 
              className="mr-3 text-gray-300 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold flex items-center">
              <span className="text-purple-400">Exercise</span>MD 
            </h1>
          </div>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-6 mr-auto ml-10">
            <Link to="/exercises" className="text-purple-400 border-b-2 border-purple-500 py-2">
              Exercises
            </Link>
            <button 
              onClick={handleProfileClick}
              className="text-gray-300 hover:text-white transition-colors py-2 flex items-center"
            >
              <User size={18} className="mr-2" />
              My Profile
            </button>
          </nav>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search exercises..."
              className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            {searchQuery && (
              <button
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                onClick={() => setSearchQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          {/* Mobile Nav and Filter Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-md"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            
            <button 
              onClick={handleProfileClick}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-md"
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ExerciseHeader; 