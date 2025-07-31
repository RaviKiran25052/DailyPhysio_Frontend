import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AccountInformation from './AccountInformation';
import ProfileAvatar from './ProfileAvatar';
import PasswordChangeModal from '../Modals/PasswordChangeModal';
import ProfileEditModal from '../Modals/ProfileEditModal';
import ImageUploadModal from '../Modals/ImageUploadModal';
import AccountDetails from './AccountDetails';
import MembershipInformation from './MembershipInformation';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

const ProfileInfo = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    profileImage: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    try {
      const fetchUserData = async () => {
        try {
          const parsedToken = token;
          const response = await axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${parsedToken}` }
          });

          if (response.status === 200) {
            setUserData(response.data);
            setProfileData({
              fullName: response.data.fullName,
              email: response.data.email,
              profileImage: response.data.profileImage
            });
          }
        } catch (apiError) {
          console.error('Error fetching profile data:', apiError);
          toast.error('Failed to fetch profile data');
        }
      };
      fetchUserData();

    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('An error occurred while loading profile');
    }
  }, []);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePasswordSubmit = async (passwordData) => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/profile`,
        { password: passwordData.new },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Password updated successfully');
      setShowPasswordModal(false);
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = data instanceof FormData ? data : new FormData();

      // Add text fields if not part of FormData
      if (!(data instanceof FormData)) {
        formData.append('fullName', profileData.fullName);
        formData.append('email', profileData.email);
      }

      const response = await axios.put(`${API_URL}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      localStorage.setItem('fullName', response.data.fullName);
      window.location.reload()
      // Update local state with new user data
      setUserData(prevData => ({
        ...prevData,
        ...response.data
      }));

      setProfileData({
        fullName: response.data.fullName,
        email: response.data.email,
        profileImage: response.data.profileImage
      });

      toast.success('Profile updated successfully');
      setShowProfileEditModal(false);
      setShowImageUploadModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const createdAtFormatted = formatDate(userData.createdAt);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header/Banner */}
      <div className="h-20 md:h-28 bg-gradient-to-r from-primary-700 to-primary-900 relative" />

      {/* Profile Section */}
      <div className="px-6 pt-0 pb-6 relative">
        {/* Avatar with Edit Button */}
        <ProfileAvatar
          user={userData}
          openImageUploadModal={() => setShowImageUploadModal(true)}
        />

        {/* Name and Details */}
        <div className="md:pl-32 md:pt-0 pl-0 pt-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-white">{userData.fullName}</h1>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <button
                onClick={() => setShowProfileEditModal(true)}
                className="px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <p className="text-gray-400 mt-1">
            {userData.email}
          </p>
          <p className="text-gray-400 mt-1">
            Created: {createdAtFormatted}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Account Information */}
            <AccountInformation
              user={userData}
              openPasswordChangeModal={() => setShowPasswordModal(true)}
            />

            {/* Account Details */}
            <AccountDetails user={userData} formatDate={formatDate} />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Membership Information */}
            <MembershipInformation user={userData} formatDate={formatDate} />

            {/* Payment History */}
            <div className="bg-primary-800 p-4 rounded-lg">
              <h3 className="text-primary-400 font-medium mb-2">Recent Payments</h3>
              <div className="bg-primary-700 rounded-md p-3 text-center">
                <p className="text-gray-300 text-sm">No payment receipts available</p>
                {userData.membership?.type === 'free' && (
                  <p className="text-gray-400 text-xs mt-1">Upgrade to Pro to see your payment history</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        loading={loading}
      />

      {/* Profile Edit Modal with Confirmation */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        profileData={profileData}
        onProfileChange={handleProfileChange}
        onSubmit={handleProfileSubmit}
        loading={loading}
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        loading={loading}
        imagePreview={profileData.profileImage}
        isOpen={showImageUploadModal}
        onClose={() => {
          setShowImageUploadModal(false);
        }}
        onSubmit={handleProfileSubmit}
      />
    </div>
  );
};

export default ProfileInfo;