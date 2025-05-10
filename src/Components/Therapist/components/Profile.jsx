import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RiUser3Line, RiMailLine, RiPhoneLine, RiHospitalLine, RiMapPinLine, RiCalendarLine, RiEditLine } from 'react-icons/ri';
import ProfileEditModal from './ProfileEditModal';

const API_URL = process.env.REACT_APP_API_URL;

const Profile = () => {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchTherapistDetails();
  }, []);

  const fetchTherapistDetails = async () => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      const response = await axios.get(`${API_URL}/therapist/`, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });
      
      // Since the endpoint returns an array, get the first item
      setTherapist(response.data[0]);
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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center space-x-2 px-4 py-2 mt-4 md:mt-0 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RiEditLine />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="col-span-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-800 text-4xl font-bold mb-4">
              {therapist.name.charAt(0)}
            </div>
            <h3 className="text-xl font-semibold text-white">{therapist.name}</h3>
            <p className="text-purple-200 mt-1">{therapist.specializations.join(', ')}</p>
            <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              {therapist.experience} Experience
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <RiMailLine className="text-purple-500 mr-3" size={20} />
              <span>{therapist.email}</span>
            </div>
            <div className="flex items-center">
              <RiPhoneLine className="text-purple-500 mr-3" size={20} />
              <span>{therapist.phoneNumber}</span>
            </div>
            <div className="flex items-center">
              <RiHospitalLine className="text-purple-500 mr-3" size={20} />
              <span>{therapist.workingAt}</span>
            </div>
            <div className="flex items-start">
              <RiMapPinLine className="text-purple-500 mr-3 mt-1" size={20} />
              <span>{therapist.address}</span>
            </div>
          </div>
        </div>

        {/* Specializations Card */}
        <div className="col-span-1 bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-4">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {therapist.specializations.map((spec, index) => (
              <span 
                key={index} 
                className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Account Info Card */}
        <div className="col-span-1 bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Account Status</p>
              <div className="flex items-center mt-1">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  therapist.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                <span className="capitalize">{therapist.status}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Gender</p>
              <p className="capitalize mt-1">{therapist.gender}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Member Since</p>
              <div className="flex items-center mt-1">
                <RiCalendarLine className="text-purple-500 mr-2" />
                <span>{new Date(therapist.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          therapist={therapist}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile; 