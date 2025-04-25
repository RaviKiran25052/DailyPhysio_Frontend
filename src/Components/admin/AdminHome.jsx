import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaDumbbell,
  FaUserMd,
  FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    exercises: 0,
    users: 0,
    therapists: 0
  });
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);

  const handleLogout = () => {
    // Remove admin info from storage
    localStorage.clear();
    sessionStorage.clear();
    navigate('/admin/login');
  };

  useEffect(() => {
    // Check if admin is logged in
    const loggedInAdmin = localStorage.getItem('adminInfo')
      ? JSON.parse(localStorage.getItem('adminInfo'))
      : sessionStorage.getItem('adminInfo')
        ? JSON.parse(sessionStorage.getItem('adminInfo'))
        : null;

    if (!loggedInAdmin) {
      navigate('/admin/login');
      return;
    }

    setAdminInfo(loggedInAdmin);

    // Fetch statistics from the backend
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Configure headers with token
        const config = {
          headers: {
            Authorization: `Bearer ${loggedInAdmin.token}`,
          },
        };

        // First try to fetch from the dedicated stats endpoint
        try {
          const { data } = await axios.get(`${API_URL}/admin/stats`, config);
          setStats({
            exercises: data.exercisesCount || 0,
            users: data.usersCount || 0,
            therapists: data.therapistsCount || 0
          });
          setLoading(false);

        } catch (error) {
          console.error('Error fetching from stats endpoint:', error);

          // Fall back to individual endpoints if stats endpoint fails
          try {
            // Fetch exercise count
            const exercisesResponse = await axios.get(`${API_URL}/exercises/all`, config);
            const exercisesCount = exercisesResponse.data.total || exercisesResponse.data.exercises.length;

            // Fetch user counts
            const usersResponse = await axios.get(`${API_URL}/users`, config);
            const allUsers = usersResponse.data.users || [];

            // Filter users by role
            const regularUsers = allUsers.filter(user => user.role === 'isUser').length;
            const therapists = allUsers.filter(user => user.role === 'isTherapist').length;

            setStats({
              exercises: exercisesCount,
              users: regularUsers,
              therapists: therapists
            });
          } catch (fallbackError) {
            console.error('Error fetching individual data:', fallbackError);
            toast.error('Unable to fetch statistics');
            // Keep the default zeros in the state
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
        toast.error('Failed to load dashboard data');

        // If token is invalid, redirect to login
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/admin/home">
            <h1 className="text-2xl font-bold text-purple-500">ExerciseMD Admin</h1>
          </Link>

          <div className="flex items-center">
            {adminInfo && (
              <span className="text-gray-300 mr-4">Welcome, {adminInfo.fullName}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
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
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-transform duration-300 transform hover:-translate-y-1">
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
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-transform duration-300 transform hover:-translate-y-1">
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
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-transform duration-300 transform hover:-translate-y-1">
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