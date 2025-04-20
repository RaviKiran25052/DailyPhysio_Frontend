import React, { useState } from 'react';
import { FiEdit3, FiMail, FiPhone, FiMapPin, FiCalendar, FiMessageSquare } from 'react-icons/fi';

const PersonalInfo = ({ userData, updateUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserData(formData);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Reset form data if canceling edit
      setFormData({ ...userData });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-gray-800 shadow-lg overflow-hidden">
      {/* Page Title */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          Personal Information
        </h1>
      </div>

      {/* Single Tab */}
      <div className="flex border-b border-gray-700">
        <div className="flex-1 py-3 px-4 text-center text-blue-400 border-b-2 border-blue-500">
          My Profile
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button 
            onClick={toggleEdit} 
            className={`flex items-center text-sm px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <FiEdit3 className="mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                <p className="text-white font-medium">{userData.name}</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Username</label>
                <p className="text-white font-medium">{userData.username}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <div className="flex items-center text-white">
                <FiMail className="text-purple-400 mr-2" />
                <p>{userData.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone</label>
              <div className="flex items-center text-white">
                <FiPhone className="text-purple-400 mr-2" />
                <p>{userData.phone || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Location</label>
              <div className="flex items-center text-white">
                <FiMapPin className="text-purple-400 mr-2" />
                <p>{userData.location || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Member Since</label>
              <div className="flex items-center text-white">
                <FiCalendar className="text-purple-400 mr-2" />
                <p>{userData.memberSince || 'Not available'}</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Bio</label>
              <div className="flex items-start text-white">
                <FiMessageSquare className="text-purple-400 mr-2 mt-1" />
                <p>{userData.bio || 'No bio provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfo; 