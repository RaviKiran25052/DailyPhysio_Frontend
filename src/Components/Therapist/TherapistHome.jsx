import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

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
      navigate('/therapist/login');
      return;
    }

    setTherapistInfo(loggedInTherapist);
  }, [navigate]);

  const renderTab = (tab) => {
    switch (tab) {
      case 'main':
        return <Dashboard />;
      case 'consultation':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Consultation Management</h2>
            <p className="text-gray-300">Manage your consultations here.</p>
          </div>
        );
      case 'exercise':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Exercise Management</h2>
            <p className="text-gray-300">Manage your exercises here.</p>
          </div>
        );
      case 'user':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-gray-300">Manage your users here.</p>
          </div>
        );
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
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold">
              {activeTab === 'main' ? 'Dashboard' : 
               activeTab === 'consultation' ? 'Consultation Management' :
               activeTab === 'exercise' ? 'Exercise Management' : 'User Management'}
            </h1>
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