import React, { useState } from 'react';
import { FiUser, FiLock, FiLogOut, FiToggleLeft, FiToggleRight, FiMail, FiAlertCircle } from 'react-icons/fi';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  
  // Mock user data
  const userData = {
    email: "user@example.com",
    accountCreated: "January 15, 2023",
    lastLogin: "August 10, 2023",
    accountType: "Premium",
    securityQuestions: 2
  };

  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="bg-gray-900 shadow-lg overflow-hidden">
      {/* Page Title */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          Account Settings
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'account' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('account')}
        >
          General
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'security' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'notifications' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'account' && (
          <div>
            <div className="space-y-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center mb-4">
                  <FiUser className="text-purple-400 mr-2" size={20} />
                  <h3 className="font-medium text-white">Account Information</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email</span>
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Account Created</span>
                    <span>{userData.accountCreated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Login</span>
                    <span>{userData.lastLogin}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center mb-4">
                  <FiUser className="text-purple-400 mr-2" size={20} />
                  <h3 className="font-medium text-white">Subscription</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Plan</span>
                    <span className="px-2 py-1 bg-purple-600 rounded text-xs font-medium">
                      {userData.accountType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Billing Cycle</span>
                    <span>Monthly</span>
                  </div>
                  <div className="mt-4">
                    <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="py-2 px-4 text-sm flex items-center text-red-400 hover:text-red-300 transition">
                  <FiLogOut className="mr-2" size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div>
            <div className="space-y-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center mb-4">
                  <FiLock className="text-purple-400 mr-2" size={20} />
                  <h3 className="font-medium text-white">Password</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Last changed: 45 days ago
                  </p>
                  <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center mb-4">
                  <FiAlertCircle className="text-purple-400 mr-2" size={20} />
                  <h3 className="font-medium text-white">Security Questions</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    You have set up {userData.securityQuestions} security questions
                  </p>
                  <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
                    Manage Security Questions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <div className="space-y-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-4 text-white">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-3" size={18} />
                      <span className="text-gray-200">Email Notifications</span>
                    </div>
                    <button 
                      onClick={() => toggleNotification('email')}
                      className="focus:outline-none"
                    >
                      {notifications.email 
                        ? <FiToggleRight className="text-purple-500" size={24} /> 
                        : <FiToggleLeft className="text-gray-500" size={24} />
                      }
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-3" size={18} />
                      <span className="text-gray-200">Push Notifications</span>
                    </div>
                    <button 
                      onClick={() => toggleNotification('push')}
                      className="focus:outline-none"
                    >
                      {notifications.push 
                        ? <FiToggleRight className="text-purple-500" size={24} /> 
                        : <FiToggleLeft className="text-gray-500" size={24} />
                      }
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-3" size={18} />
                      <span className="text-gray-200">SMS Notifications</span>
                    </div>
                    <button 
                      onClick={() => toggleNotification('sms')}
                      className="focus:outline-none"
                    >
                      {notifications.sms 
                        ? <FiToggleRight className="text-purple-500" size={24} /> 
                        : <FiToggleLeft className="text-gray-500" size={24} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings; 