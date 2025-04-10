import React, { useState } from 'react';

const ProfileSettings = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState(settings);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };
  
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">Account Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Notifications</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="emailNotifications" className="ml-3 text-white">
                Email Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smsNotifications"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleChange}
                className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="smsNotifications" className="ml-3 text-white">
                SMS Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketingEmails"
                name="marketingEmails"
                checked={formData.marketingEmails}
                onChange={handleChange}
                className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="marketingEmails" className="ml-3 text-white">
                Marketing Emails
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Privacy</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="profileVisibility"
                name="profileVisibility"
                checked={formData.profileVisibility}
                onChange={handleChange}
                className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="profileVisibility" className="ml-3 text-white">
                Public Profile
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="shareActivity"
                name="shareActivity"
                checked={formData.shareActivity}
                onChange={handleChange}
                className="w-5 h-5 bg-gray-800 border-gray-700 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="shareActivity" className="ml-3 text-white">
                Share Activity with Colleagues
              </label>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Account Security</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-400 mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings; 