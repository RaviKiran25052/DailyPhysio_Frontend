import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UserManagement from './UserManagement';
import TherapistManagement from './Therapist/TherapistManagement';
import AdminExerciseList from './AdminExerciseList';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminHome = () => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main');

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

    // Fetch analytics data
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${loggedInAdmin.token}`,
          },
        };

        const { data } = await axios.get(`${BASE_URL}/admin/analytics`, config);

        if (data.success) {
          setAnalyticsData(data.data);
        } else {
          toast.error('Failed to load analytics data');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
        toast.error('Failed to load dashboard data');

        // If token is invalid, redirect to login
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      }
    };

    fetchAnalytics();
  }, [navigate]);

  const renderTab = (tab) => {
    switch (tab) {
      case 'main':
        return "DashBoard";
      case 'user':
        return <UserManagement />;
        case 'exercise':
          return <AdminExerciseList/>;
      case 'therapist':
        return <TherapistManagement />;
      default:
        break;
    }
  }

  const calculateTotals = () => {
    if (!analyticsData) return { users: 0, exercises: 0, therapists: 0 };

    const users =
      (analyticsData.users.regularUsersCount || 0) +
      (analyticsData.users.proUsersCount || 0) +
      (analyticsData.users.therapistCreatedUsersCount || 0);

    const exercises =
      (analyticsData.exercises.exercisesByCreator.therapist || 0) +
      (analyticsData.exercises.exercisesByCreator.proUser || 0) +
      (analyticsData.exercises.exercisesByCreator.admin || 0);

    const therapists = Object.values(analyticsData.therapists.statusCounts).reduce((sum, count) => sum + count, 0);

    return { users, exercises, therapists };
  };

  const totals = calculateTotals();

  return (
    <div className="flex h-screen bg-gray-800">
      {/* Sidebar */}
      <Sidebar tab={activeTab} setTab={(tab) => setActiveTab(tab)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          adminInfo={adminInfo}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto">
          {loading ? <></> :
            <>
              {renderTab(activeTab)}
            </>
          }
        </main>
      </div>
    </div>
  );
};

export default AdminHome;