import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaDumbbell, 
  FaUserMd, 
  FaSignOutAlt 
} from 'react-icons/fa';

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    exercises: 0,
    users: 0,
    therapists: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch statistics from the backend
    const fetchStats = async () => {
      try {
        // Replace with actual API calls to your backend
        // Example:
        // const exercisesCount = await fetch('/api/exercises/count');
        // const usersCount = await fetch('/api/users/count?role=isUser');
        // const therapistsCount = await fetch('/api/users/count?role=isTherapist');
        
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            exercises: 248,
            users: 156,
            therapists: 32
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    // Implement logout logic
    // For example: authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/admin">
            <h1 className="text-2xl font-bold text-purple-500">ExerciseMD Admin</h1>
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-extrabold text-white mb-8">Dashboard</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exercise Card */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 flex flex-col items-center h-full">
                <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mb-6">
                  <FaDumbbell className="text-purple-400 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Exercises</h3>
                <div className="text-4xl font-bold text-purple-500 mb-4">{stats.exercises}</div>
                <p className="text-gray-400 text-center mb-6">Total exercises available in the platform</p>
                <Link 
                  to="/admin/exercises" 
                  className="mt-auto w-full px-4 py-2 bg-gray-700 hover:bg-purple-600 text-white text-center rounded-md transition-colors duration-300"
                >
                  Manage Exercises
                </Link>
              </div>
            </div>
            
            {/* Users Card */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 flex flex-col items-center h-full">
                <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mb-6">
                  <FaUsers className="text-purple-400 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Users</h3>
                <div className="text-4xl font-bold text-purple-500 mb-4">{stats.users}</div>
                <p className="text-gray-400 text-center mb-6">Active users registered on the platform</p>
                <Link 
                  to="/admin/users" 
                  className="mt-auto w-full px-4 py-2 bg-gray-700 hover:bg-purple-600 text-white text-center rounded-md transition-colors duration-300"
                >
                  Manage Users
                </Link>
              </div>
            </div>
            
            {/* Therapists Card */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6 flex flex-col items-center h-full">
                <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center mb-6">
                  <FaUserMd className="text-purple-400 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Therapists</h3>
                <div className="text-4xl font-bold text-purple-500 mb-4">{stats.therapists}</div>
                <p className="text-gray-400 text-center mb-6">Therapists providing professional care</p>
                <Link 
                  to="/admin/therapists" 
                  className="mt-auto w-full px-4 py-2 bg-gray-700 hover:bg-purple-600 text-white text-center rounded-md transition-colors duration-300"
                >
                  Manage Therapists
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-4 text-center text-gray-400">
        <p>© {new Date().getFullYear()} ExerciseMD Admin Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminHome; 