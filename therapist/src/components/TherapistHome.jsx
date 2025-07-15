import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Consultations from './Consultations'
import ExerciseManagement from './ExerciseManagement';
import UserManagement from './UserManagement';
import Profile from './Profile';
import MembershipManagement from './MembershipManagement';

const TherapistHome = () => {
  const navigate = useNavigate();
  const [therapistInfo, setTherapistInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('main');

  useEffect(() => {
    // Check if therapist is logged in
    const loggedInTherapist = localStorage.getItem('therapistInfo')
      ? JSON.parse(localStorage.getItem('therapistInfo'))
      : null;

    if (!loggedInTherapist) {
      navigate('/therapist/');
      return;
    }

    setTherapistInfo(loggedInTherapist);
  }, [navigate]);

  const renderTab = (tab) => {
    switch (tab) {
      case 'main':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'consultation':
        return <Consultations />;
      case 'exercise':
        return <ExerciseManagement />;
      case 'user':
        return <UserManagement />;
      case 'membership':
        return <MembershipManagement />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('therapistInfo');
    navigate('/therapist/');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar tab={activeTab} setTab={setTab => setActiveTab(setTab)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-end px-6 py-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Welcome, {therapistInfo?.name || 'Therapist'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
          {renderTab(activeTab)}
        </main>
      </div>
    </div>
  );
};

export default TherapistHome; 