import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import UserManagement from './UserManagement';
import TherapistManagement from './TherapistManagement';
import AdminExerciseList from './AdminExerciseList';
import DashBoard from './DashBoard';

const AdminHome = () => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('main');

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    // Check if admin is logged in
    const loggedInAdmin = localStorage.getItem('adminInfo')
      ? JSON.parse(localStorage.getItem('adminInfo'))
      : null;

    if (!loggedInAdmin) {
      navigate('/login');
      return;
    }

    setAdminInfo(loggedInAdmin);
  }, [navigate]);

  const renderTab = (tab) => {
    switch (tab) {
      case 'main':
        return <DashBoard />;
      case 'user':
        return <UserManagement />;
      case 'exercise':
        return <AdminExerciseList />;
      case 'therapist':
        return <TherapistManagement />;
      default:
        break;
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar tab={activeTab} setTab={(tab) => setActiveTab(tab)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          adminInfo={adminInfo}
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto">
          {renderTab(activeTab)}
        </main>
      </div>
    </div>
  );
};

export default AdminHome;