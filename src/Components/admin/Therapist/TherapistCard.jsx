import React from 'react';
import { FaUserMd, FaEdit, FaEnvelope, FaHospital, FaUserFriends } from 'react-icons/fa';

const TherapistCard = ({ therapist, onEdit }) => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:border-purple-500 rounded-2xl shadow-xl hover:shadow-purple-800/50 transition-all duration-300 overflow-hidden relative group p-6">
      {/* Header: Icon + Info */}
      <div className="flex items-start mb-4 space-x-4">
        {/* Icon */}
        <div className="bg-gradient-to-br from-purple-700 to-purple-900 p-4 rounded-full shadow-lg group-hover:rotate-6 transition duration-500">
          <FaUserMd className="text-white text-2xl" />
        </div>

        {/* Name + Line + Specializations */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">Dr. {therapist.name}</h3>
          <div className="h-0.5 bg-purple-600 to-transparent my-1 w-[90%]"></div>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white">
            {therapist.specializations.map((spec, index) => (
              <React.Fragment key={index}>
                <span className="text-purple-300">{spec}</span>
                {index !== therapist.specializations.length - 1 && (
                  <span className="mx-1 text-base text-white">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="overflow-hidden">
            <div className="flex items-center space-x-2 mb-1">
              <FaEnvelope className="text-purple-400 flex-shrink-0" />
              <span className="text-gray-400 font-medium">Email</span>
            </div>
            <span className="text-gray-300 text-sm truncate block">{therapist.email}</span>
          </div>

          {/* Hospital/Clinic */}
          <div className="overflow-hidden">
            <div className="flex items-center space-x-2 mb-1">
              <FaHospital className="text-purple-400 flex-shrink-0" />
              <span className="text-gray-400 font-medium">Hospital/Clinic</span>
            </div>
            <span className="text-gray-300 text-sm truncate block">{therapist.workingAt}</span>
          </div>

          {/* Consultation Count */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <FaUserFriends className="text-purple-400" />
              <span className="text-gray-400 font-medium">Consultations</span>
            </div>
            <span className="text-purple-300 font-semibold">{therapist.consultationCount}</span>
          </div>

          {/* Experience */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <FaUserMd className="text-purple-400" />
              <span className="text-gray-400 font-medium">Experience</span>
            </div>
            <span className="text-purple-300 italic">{therapist.experience} years</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent my-6 rounded-full"></div>

      {/* Buttons */}
      <div className="flex justify-between items-center gap-4">
        {therapist.status === 'active' && <span className="px-3 py-2 inline-flex text-xs leading-5 font-medium rounded-full bg-green-900/30 text-green-400 border border-green-500/30">Verified</span>}
        {therapist.status === 'rejected' && <span className="px-3 py-2 inline-flex text-xs leading-5 font-medium rounded-full bg-red-900/30 text-red-400 border border-red-500/30">Rejected</span>}
        {therapist.status === 'inactive' && <span className="px-3 py-2 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">Inactive</span>}
        <button
          onClick={() => onEdit(therapist)}
          className="flex items-center px-4 py-2 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-800 hover:text-white transition-all duration-200 shadow-sm"
        >
          <FaEdit className="mr-2" /> Edit
        </button>
      </div>
    </div>
  );
};

export default TherapistCard;