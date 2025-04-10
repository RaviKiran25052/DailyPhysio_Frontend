import React, { useState } from 'react';
import { FiSettings, FiLock, FiBell, FiShield, FiToggleRight, FiToggleLeft } from 'react-icons/fi';

const SettingsSection = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-5 mb-6">
      <h3 className="text-white font-semibold text-lg flex items-center mb-4">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      {children}
    </div>
  );
};

const ToggleOption = ({ label, description, isEnabled, onChange }) => {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-600 last:border-0">
      <div>
        <h4 className="text-white font-medium">{label}</h4>
        {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      <button 
        onClick={() => onChange(!isEnabled)}
        className="text-2xl"
      >
        {isEnabled ? (
          <FiToggleRight className="text-purple-400" size={24} />
        ) : (
          <FiToggleLeft className="text-gray-500" size={24} />
        )}
      </button>
    </div>
  );
};

const AccountSettings = ({ userData, updateUserData }) => {
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    darkMode: true,
    autoSave: true,
    privacyMode: false
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Error handling
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleToggle = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Here you would typically send the update to an API
    console.log(`Updated ${setting} to ${value}`);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous messages
    setError('');
    setSuccess('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    // Here you would typically send the update to an API
    console.log('Password updated');
    setSuccess('Password updated successfully');
    
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FiSettings className="mr-3 text-purple-400" />
          Account Settings
        </h2>
      </div>

      <div className="p-6">
        {/* Notification Settings */}
        <SettingsSection 
          title="Notifications" 
          icon={<FiBell className="text-purple-400" />}
        >
          <div className="space-y-2">
            <ToggleOption 
              label="Email Notifications" 
              description="Receive updates about your account via email"
              isEnabled={settings.emailNotifications}
              onChange={(value) => handleToggle('emailNotifications', value)}
            />
            <ToggleOption 
              label="SMS Notifications" 
              description="Receive important alerts via text message"
              isEnabled={settings.smsNotifications}
              onChange={(value) => handleToggle('smsNotifications', value)}
            />
          </div>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection 
          title="Security" 
          icon={<FiShield className="text-purple-400" />}
        >
          <div className="space-y-2">
            <ToggleOption 
              label="Two-Factor Authentication" 
              description="Add an extra layer of security to your account"
              isEnabled={settings.twoFactorAuth}
              onChange={(value) => handleToggle('twoFactorAuth', value)}
            />
            <ToggleOption 
              label="Privacy Mode" 
              description="Hide your profile from other users"
              isEnabled={settings.privacyMode}
              onChange={(value) => handleToggle('privacyMode', value)}
            />
          </div>
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection 
          title="Preferences" 
          icon={<FiSettings className="text-purple-400" />}
        >
          <div className="space-y-2">
            <ToggleOption 
              label="Dark Mode" 
              description="Use dark theme throughout the application"
              isEnabled={settings.darkMode}
              onChange={(value) => handleToggle('darkMode', value)}
            />
            <ToggleOption 
              label="Auto Save" 
              description="Automatically save your progress"
              isEnabled={settings.autoSave}
              onChange={(value) => handleToggle('autoSave', value)}
            />
          </div>
        </SettingsSection>

        {/* Password Change */}
        <SettingsSection 
          title="Change Password" 
          icon={<FiLock className="text-purple-400" />}
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-2 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-900/30 border border-green-700 text-green-200 px-4 py-2 rounded">
                {success}
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-white transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </SettingsSection>
      </div>
    </div>
  );
};

export default AccountSettings; 