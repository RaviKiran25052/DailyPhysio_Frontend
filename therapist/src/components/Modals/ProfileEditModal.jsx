import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL;

// Available specialization options
const specializationOptions = [
  'Orthopedics',
  'Neurology',
  'Pediatric Therapy',
  'Sports Medicine',
  'Geriatric Care',
  'Manual Therapy',
  'Cardiopulmonary',
  'Sports Rehabilitation',
  'Women\'s Health',
  'Other'
];

const ProfileEditModal = ({ isOpen, onClose, therapist, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: therapist.name || '',
    email: therapist.email || '',
    bio: therapist.bio || '',
    specializations: therapist.specializations || [],
    experience: therapist.experience || '',
    gender: therapist.gender || 'male',
    workingAt: therapist.workingAt || '',
    address: therapist.address || '',
    phoneNumber: therapist.phoneNumber || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [otherSpecialization, setOtherSpecialization] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle specialization selection from dropdown
  const handleSpecializationSelect = (e) => {
    setSelectedSpecialization(e.target.value);
  };

  // Handle other specialization input
  const handleOtherSpecializationChange = (e) => {
    setOtherSpecialization(e.target.value);
  };

  // Add specialization to the list
  const addSpecialization = () => {
    if (selectedSpecialization === 'Other') {
      if (otherSpecialization.trim() && !formData.specializations.includes(otherSpecialization.trim())) {
        setFormData({
          ...formData,
          specializations: [...formData.specializations, otherSpecialization.trim()]
        });
        setOtherSpecialization('');
      }
    } else if (selectedSpecialization && !formData.specializations.includes(selectedSpecialization)) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, selectedSpecialization]
      });
    }

    // Clear error for specializations
    if (errors.specializations) {
      setErrors({
        ...errors,
        specializations: null
      });
    }
  };

  // Remove specialization from the list
  const removeSpecialization = (specialization) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter(s => s !== specialization)
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.specializations.length === 0) {
      newErrors.specializations = 'At least one specialization is required';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required';
    }

    if (!formData.workingAt.trim()) {
      newErrors.workingAt = 'Hospital/Clinic name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
        const response = await axios.put(
          `${API_URL}/therapist/`,
          formData,
          {
            headers: { Authorization: `Bearer ${therapistInfo.token}` }
          }
        );

        onUpdate(response.data);
        onClose();
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Update failed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 bg-primary-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-primary-600 border ${errors.name ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="Dr. John Smith"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-primary-600 border ${errors.email ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="doctor@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder='Add information about your professional background'
                  className={`w-full px-3 py-2 bg-primary-600 border ${errors.bio ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
                )}
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Specializations <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="bg-primary-600 text-white text-sm px-3 py-1 rounded-full flex items-center"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecialization(spec)}
                        className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={selectedSpecialization}
                    onChange={handleSpecializationSelect}
                    className="flex-1 px-3 py-2 bg-primary-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a specialization</option>
                    {specializationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addSpecialization}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>

                {selectedSpecialization === 'Other' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={otherSpecialization}
                      onChange={handleOtherSpecializationChange}
                      placeholder="Enter specialization"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {errors.specializations && (
                  <p className="mt-1 text-sm text-red-500">{errors.specializations}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-primary-600 border ${errors.experience ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="5 years"
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-500">{errors.experience}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600"
                    />
                    <label htmlFor="male" className="ml-2 text-sm text-gray-300">
                      Male
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600"
                    />
                    <label htmlFor="female" className="ml-2 text-sm text-gray-300">
                      Female
                    </label>
                  </div>
                </div>
              </div>

              {/* Hospital/Clinic */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Hospital/Clinic Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="workingAt"
                  value={formData.workingAt}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-primary-600 border ${errors.workingAt ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="City General Hospital"
                />
                {errors.workingAt && (
                  <p className="mt-1 text-sm text-red-500">{errors.workingAt}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 bg-primary-600 border ${errors.address ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="123 Medical Center Blvd, New York, NY"
                ></textarea>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-primary-600 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
                    } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal; 