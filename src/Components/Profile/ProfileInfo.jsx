import React, { useState } from 'react';
import AccountInformation from './AccountInformation';
import ProfileAvatar from './ProfileAvatar';
import PasswordChangeModal from './PasswordChangeModal';
import ProfileEditModal from './ProfileEditModal';
import ImageUploadModal from './ImageUploadModal';
import AccountDetails from './AccountDetails';
import MembershipInformation from './MembershipInformation';

const ProfileInfo = ({ user }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-400">User information not available</p>
      </div>
    );
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePasswordSubmit = (passwordData) => {
    // Handle password change logic here
    console.log('Password change submitted', passwordData);
    setShowPasswordModal(false);
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = () => {
    // Handle profile update logic here
    console.log('Profile update submitted', profileData);
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    // Handle image upload logic here
    console.log('Image upload submitted', selectedImage);
    setShowImageUploadModal(false);
    // Keep the preview to show in the UI (in a real app you'd update user.profileImage)
  };

  const createdAtFormatted = formatDate(user.createdAt);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header/Banner */}
      <div className="h-32 bg-gradient-to-r from-purple-900 to-indigo-900 relative" />
      
      {/* Profile Section */}
      <div className="px-6 pt-0 pb-6 relative">
        {/* Avatar with Edit Button */}
        <ProfileAvatar
          user={user}
          imagePreview={imagePreview}
          openImageUploadModal={() => setShowImageUploadModal(true)}
        />

        {/* Name and Details */}
        <div className="pl-32">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-white">{user.fullName}</h1>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <button
                onClick={() => setShowProfileEditModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <p className="text-gray-400 mt-1">
            {user.email}
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
              user={user}
              openPasswordChangeModal={() => setShowPasswordModal(true)}
            />

            {/* Account Details */}
            <AccountDetails user={user} formatDate={formatDate} />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Membership Information */}
            <MembershipInformation user={user} formatDate={formatDate} />

            {/* Payment History */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-purple-400 font-medium mb-2">Payment History</h3>
              <div className="bg-gray-600 rounded-md p-3 text-center">
                <p className="text-gray-400 text-sm">No payment receipts available</p>
                {user.membership?.type === 'free' && (
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
      />

      {/* Profile Edit Modal with Confirmation */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        profileData={profileData}
        onProfileChange={handleProfileChange}
        onSubmit={handleProfileSubmit}
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageUploadModal}
        onClose={() => {
          setShowImageUploadModal(false);
          setImagePreview(null);
          setSelectedImage(null);
        }}
        onSubmit={handleImageUpload}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default ProfileInfo;