import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Dumbbell, Heart, FileText, Users, Plus, LogOut } from 'lucide-react';

const Sidebar = ({ userData, currentPath }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear user data from session storage
    sessionStorage.removeItem('user');
    
    // Redirect to home page
    navigate('/');
  };
  
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        {/* User Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden mb-4 border-2 border-purple-500">
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <User size={48} className="text-white opacity-80" />
            </div>
          </div>
          <h2 className="text-xl font-bold">{userData.name}</h2>
          <p className="text-sm text-gray-400">Member since {userData.joined}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <Link to="/profile" className={`flex items-center space-x-3 p-3 rounded-lg ${currentPath === 'profile' ? 'bg-purple-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <User size={18} className={currentPath === 'profile' ? "text-purple-300" : "text-gray-400"} />
            <span className="font-medium">Profile</span>
          </Link>
          <Link to="/myexercises" className={`flex items-center space-x-3 p-3 rounded-lg ${currentPath === 'myexercises' ? 'bg-purple-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <Dumbbell size={18} className={currentPath === 'myexercises' ? "text-purple-300" : "text-gray-400"} />
            <span className="font-medium">My Exercises</span>
          </Link>
          <Link to="/favorites" className={`flex items-center space-x-3 p-3 rounded-lg ${currentPath === 'favorites' ? 'bg-purple-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <Heart size={18} className={currentPath === 'favorites' ? "text-purple-300" : "text-gray-400"} />
            <span className="font-medium">My Favorites</span>
          </Link>
          <Link to="/routines" className={`flex items-center space-x-3 p-3 rounded-lg ${currentPath === 'routines' ? 'bg-purple-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <FileText size={18} className={currentPath === 'routines' ? "text-purple-300" : "text-gray-400"} />
            <span className="font-medium">My Routines</span>
          </Link>
          <Link to="/following" className={`flex items-center space-x-3 p-3 rounded-lg ${currentPath === 'following' ? 'bg-purple-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <Users size={18} className={currentPath === 'following' ? "text-purple-300" : "text-gray-400"} />
            <span className="font-medium">Following</span>
          </Link>
          <Link to="/create" className={`flex items-center space-x-3 p-3 rounded-lg ${currentPath === 'create' ? 'bg-purple-900 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
            <Plus size={18} className={currentPath === 'create' ? "text-purple-300" : "text-gray-400"} />
            <span className="font-medium">Create Exercise</span>
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 w-full text-left mt-4"
          >
            <LogOut size={18} className="text-gray-400" />
            <span className="font-medium">Log Out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar; 