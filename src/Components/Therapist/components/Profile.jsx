import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  RiMailLine,
  RiPhoneLine,
  RiHospitalLine,
  RiMapPinLine,
  RiCalendarLine,
  RiEditLine,
  RiUserLine,
  RiBriefcaseLine,
  RiVipCrownLine,
  RiUserSettingsLine,
  RiBarChartLine,
  RiShieldUserLine
} from 'react-icons/ri';
import ProfileEditModal from './ProfileEditModal';
import PasswordChangeModal from '../../PasswordChangeModal';
import ImageUploadModal from '../../Profile/ImageUploadModal';

const API_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [imgLoading, setImgLoading] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchTherapistDetails();
  }, []);

  const fetchTherapistDetails = async () => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      const response = await axios.get(`${API_URL}/therapist/`, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });
      setTherapist(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching therapist details:', error);
      toast.error('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setTherapist(updatedData);
    toast.success('Profile updated successfully');
  };

  const handlePasswordSubmit = async (passwordData) => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      await axios.put(`${API_URL}/therapist`,
        { password: passwordData.new },
        {
          headers: { Authorization: `Bearer ${therapistInfo.token}` }
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

  const handleImageUpload = async (data) => {
    setImgLoading(true);
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      const formData = data instanceof FormData ? data : new FormData();
      await axios.put(`${API_URL}/therapist`,
        formData,
        {
          headers: { Authorization: `Bearer ${therapistInfo.token}` }
        }
      );

      toast.success('Profile Pic updated successfully');
      setShowImageUploadModal(false);
      fetchTherapistDetails();
    } catch (error) {
      console.error('Error updating Profile Pic:', error);
      toast.error(error.response?.data?.message || 'Failed to update Profile Pic');
    } finally {
      setImgLoading(true)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMembershipBadgeColor = (type) => {
    switch (type) {
      case 'monthly': return 'bg-purple-600';
      case 'yearly': return 'bg-indigo-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="p-6 text-center">
        <div className="text-xl text-red-500">Failed to load profile data</div>
        <button
          onClick={fetchTherapistDetails}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Section for profile header
  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-8 rounded-xl mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          {therapist.profilePic ? (
            <img
              src={therapist.profilePic}
              alt={therapist.name}
              onClick={() => setShowImageUploadModal(true)}
              className="w-28 h-28 rounded-full object-cover border-4 border-white/30 cursor-pointer"
            />
          ) : (
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 text-4xl font-bold">
              {therapist.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-3xl font-bold text-white mb-1">{therapist.name}</h2>
          <p className="text-purple-200 text-lg mb-3">{therapist.specializations.join(', ')}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              {therapist.experience} Experience
            </span>
            <span className={`px-3 py-1 ${getMembershipBadgeColor(therapist.membership?.type)} text-white rounded-full text-sm capitalize`}>
              {therapist.membership?.type || 'Free'} Member
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-auto">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <RiEditLine />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Section component for consistent styling
  const Section = ({ title, icon, children }) => (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
      <div className="flex items-center mb-6 pb-4 border-b border-gray-700">
        {icon && <span className="text-purple-500 mr-3">{icon}</span>}
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ProfileHeader />

      <Section
        title="Personal Information"
        icon={<RiUserLine size={22} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Email</p>
            <div className="flex items-center">
              <RiMailLine className="text-purple-500 mr-2" />
              <span>{therapist.email}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Phone</p>
            <div className="flex items-center">
              <RiPhoneLine className="text-purple-500 mr-2" />
              <span>{therapist.phoneNumber}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Gender</p>
            <div className="flex items-center">
              <RiUserSettingsLine className="text-purple-500 mr-2" />
              <span className="capitalize">{therapist.gender}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Workplace</p>
            <div className="flex items-center">
              <RiHospitalLine className="text-purple-500 mr-2" />
              <span>{therapist.workingAt}</span>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <p className="text-gray-400 text-sm">Address</p>
            <div className="flex items-start">
              <RiMapPinLine className="text-purple-500 mr-2 mt-1" />
              <span>{therapist.address}</span>
            </div>
          </div>
        </div>
      </Section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section
          title="About Me"
          icon={<RiBriefcaseLine size={22} />}
        >
          <p className="text-gray-300">
            {therapist.bio || "No bio available. Add information about your professional background, treatment approach, and philosophy."}
          </p>
        </Section>

        <Section
          title="Performance & Statistics"
          icon={<RiBarChartLine size={22} />}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">Consultations</p>
              <p className="text-2xl font-bold">{therapist.consultationCount || 0}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">Followers</p>
              <div className="flex items-center justify-center">
                <p className="text-2xl font-bold">{therapist.followers || 0}</p>
              </div>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm mb-1">Member Since</p>
              <p className="text-lg font-medium">{formatDate(therapist.createdAt).split(' ')[0]} {formatDate(therapist.createdAt).split(' ')[2]}</p>
            </div>
          </div>
        </Section>
      </div>

      <Section
        title="Membership Details"
        icon={<RiVipCrownLine size={22} />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-2">Current Plan</p>
            <div className="flex items-center">
              <span className={`px-4 py-2 ${getMembershipBadgeColor(therapist.membership?.type)} text-white rounded-lg text-lg font-medium capitalize`}>
                {therapist.membership?.type || 'Free'} Plan
              </span>
            </div>
          </div>
          {therapist.membership?.paymentDate && (
            <div>
              <p className="text-gray-400 text-sm mb-2">Last Payment</p>
              <div className="flex items-center">
                <RiCalendarLine className="text-purple-500 mr-2" />
                <span>{formatDate(therapist.membership.paymentDate)}</span>
              </div>
            </div>
          )}
          {therapist.membership?.nextBillingDate && (
            <div>
              <p className="text-gray-400 text-sm mb-2">Next Billing Date</p>
              <div className="flex items-center">
                <RiCalendarLine className="text-purple-500 mr-2" />
                <span>{formatDate(therapist.membership.nextBillingDate)}</span>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section
        title="Account Security"
        icon={<RiShieldUserLine size={22} />}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <p className="text-gray-300 mb-2">Update your password and security preferences</p>
            <p className="text-gray-400 text-sm">Last password change: Never</p>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      </Section>


      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordSubmit}
        loading={loading}
      />

      {showEditModal && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          therapist={therapist}
          onUpdate={handleProfileUpdate}
        />
      )}
      <ImageUploadModal
        loading={imgLoading}
        imagePreview={therapist.profilePic}
        isOpen={showImageUploadModal}
        onClose={() => {
          setShowImageUploadModal(false);
        }}
        onSubmit={handleImageUpload}
      />
    </div>
  );
};

export default Profile;