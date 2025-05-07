import React from 'react';
import { User, Dumbbell, Heart, FileText, Users, Plus, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userData, currentPath, setActiveTab }) => {
  const navigate = useNavigate();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.clear();

    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-[80vh] justify-between">
      {/* User info header */}
      <div>
        <div className="p-6 bg-gray-700 border-b border-gray-600">
          <div className="flex items-center">
            <div className="h-14 w-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
              {userData.fullName?.split(' ').map(name => name[0]).join('').toUpperCase()}
            </div>
            <div className="ml-4">
              <h3 className="text-white font-semibold">{userData.fullName}</h3>
              <p className="text-gray-300 text-xs">{userData.email}</p>
            </div>
          </div>
        </div>

        <nav className='p-4'>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleTabClick('profile')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${currentPath === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <User className="mr-3 text-xl" />
                Profile
              </button>
            </li>

            <li>
              <button
                onClick={() => handleTabClick('routines')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${currentPath === 'routines' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <Dumbbell className="mr-3 text-xl" />
                My Routines
              </button>
            </li>

            <li>
              <button
                onClick={() => handleTabClick('favorites')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${currentPath === 'favorites' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <Heart className="mr-3 text-xl" />
                My Favorites
              </button>
            </li>
            {/* <li>
            <button
              onClick={() => handleTabClick('myexercises')}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center ${currentPath === 'myexercises' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
              <FileText className="mr-3 text-xl" />
              My Exercises
            </button>
          </li> */}

            <li>
              <button
                onClick={() => handleTabClick('following')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${currentPath === 'following' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <Users className="mr-3 text-xl" />
                Following
              </button>
            </li>

            {/* <li>
            <button
              onClick={() => handleTabClick('create')}
              className={`w-full text-left px-4 py-2 rounded-md flex items-center ${currentPath === 'create' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
              <Plus className="mr-3 text-xl" />
              Create Exercise
            </button>
          </li> */}
          </ul>
        </nav>

      </div>
      <div className="p-4">

        <button
          onClick={handleLogout}
          className="rounded-md py-2 text-sm text-white border-2 border-purple-600 hover:bg-purple-800 flex items-center justify-center w-full"
        >
          <LogOut className="mr-2" size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 