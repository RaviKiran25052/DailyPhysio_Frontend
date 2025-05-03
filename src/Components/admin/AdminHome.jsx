import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import subcomponents
import AdminHeader from './Dashboard/AdminHeader';
import AdminSidebar from './Dashboard/AdminSidebar';
import StatisticsCards from './Dashboard/StatisticsCards';
import AnalyticsCharts from './Dashboard/AnalyticsCharts';
import RecentActivity from './Dashboard/RecentActivity';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    exercises: 0,
    users: 0,
    therapists: 0,
    activeUsers: 0,
    completedExercises: 0,
    newUsersThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
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
            therapists: data.therapistsCount || 0,
            activeUsers: data.activeUsers || 0,
            completedExercises: data.completedExercises || 0,
            newUsersThisMonth: data.newUsersThisMonth || 0
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
              therapists: therapists,
              activeUsers: Math.floor(regularUsers * 0.7), // Placeholder data
              completedExercises: Math.floor(exercisesCount * 5), // Placeholder data
              newUsersThisMonth: Math.floor(regularUsers * 0.2) // Placeholder data
            });
          } catch (fallbackError) {
            console.error('Error fetching individual data:', fallbackError);
            toast.error('Unable to fetch statistics');
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

  // Mock data for charts
  const mockChartData = {
    userGrowth: [
      { month: 'Jan', users: 20 },
      { month: 'Feb', users: 35 },
      { month: 'Mar', users: 45 },
      { month: 'Apr', users: 60 },
      { month: 'May', users: 75 },
      { month: 'Jun', users: 90 }
    ],
    exerciseUsage: [
      { name: 'Shoulder', value: 30 },
      { name: 'Knee', value: 25 },
      { name: 'Back', value: 20 },
      { name: 'Neck', value: 15 },
      { name: 'Wrist', value: 10 }
    ],
    userActivity: [
      { day: 'Mon', sessions: 45 },
      { day: 'Tue', sessions: 52 },
      { day: 'Wed', sessions: 49 },
      { day: 'Thu', sessions: 63 },
      { day: 'Fri', sessions: 58 },
      { day: 'Sat', sessions: 40 },
      { day: 'Sun', sessions: 35 }
    ]
  };

  // Mock data for recent activity
  const recentActivities = [
    { id: 1, type: 'user', action: 'New user registered', name: 'John Doe', time: '10 minutes ago' },
    { id: 2, type: 'exercise', action: 'Exercise completed', name: 'Shoulder Rotation', user: 'Sarah Smith', time: '25 minutes ago' },
    { id: 3, type: 'therapist', action: 'New therapist joined', name: 'Dr. Michael Brown', time: '1 hour ago' },
    { id: 4, type: 'user', action: 'User updated profile', name: 'Emma Wilson', time: '2 hours ago' },
    { id: 5, type: 'exercise', action: 'New exercise added', name: 'Knee Flexion', time: '3 hours ago' }
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        activeItem="dashboard" 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
          adminInfo={adminInfo} 
          handleLogout={handleLogout} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto bg-gray-900 p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-white mb-6">Dashboard Overview</h1>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                {/* Statistics Cards */}
                <StatisticsCards stats={stats} />
                
                {/* Analytics Charts */}
                <AnalyticsCharts chartData={mockChartData} />
                
                {/* Recent Activity */}
                <RecentActivity activities={recentActivities} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
