import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Consultations from './components/Consultations'
import ExerciseManagement from './components/ExerciseManagement';
import UserManagement from './components/UserManagement';

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
        return <div>Profile Management</div>;
      case 'consultation':
        return <Consultations />;
      case 'exercise':
        return <ExerciseManagement />;
      case 'user':
        return <UserManagement />;
      case 'membership':
        return <div>Membership Management</div>;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('therapistInfo');
    navigate('/therapist/login');
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