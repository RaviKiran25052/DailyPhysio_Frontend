import React from 'react';
import { FaUserMd, FaEdit, FaTrash, FaEnvelope, FaHospital, FaStethoscope, FaUserFriends, FaBell } from 'react-icons/fa';

const TherapistCard = ({ therapist, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden relative hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-purple-500">
      {/* Request Count Badge - Bell notification */}
      {therapist.requestCount > 0 && (
        <div className="absolute top-3 right-3 bg-purple-600 text-white rounded-full h-9 w-9 flex items-center justify-center">
          <div className="relative">
            <FaBell className="text-white" />
            <span className="absolute -top-1 -right-1 bg-white text-purple-600 rounded-full text-xs font-bold w-4 h-4 flex items-center justify-center">
              {therapist.requestCount}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Therapist Header */}
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-3 rounded-full mr-4 shadow-md">
              <FaUserMd className="text-white text-xl" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{therapist.name}</h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {therapist.specializations.map((spec, index) => (
                <span 
                  key={index}
                  className="bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <FaEnvelope className="mr-1" />
              <span>{therapist.email}</span>
            </div>
          </div>
        </div>
        
        {/* Therapist Details - Enhanced with gradients and better spacing */}
        <div className="space-y-4 mb-4 bg-gray-750 p-4 rounded-lg">
          <div className="flex items-start">
            <FaHospital className="text-purple-400 mt-1 mr-3 text-lg" />
            <div>
              <p className="text-gray-400 text-sm font-medium">Hospital/Clinic</p>
              <p className="text-white font-semibold">{therapist.workingAt}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <FaUserFriends className="text-purple-400 mt-1 mr-3 text-lg" />
            <div>
              <p className="text-gray-400 text-sm font-medium">Consultation Count</p>
              <p className="text-white font-semibold">
                <span className="text-purple-300 text-xl">{therapist.consultationCount}</span> 
                <span className="text-gray-500 text-sm ml-1">sessions</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Experience tag */}
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
            {therapist.experience} experience
          </span>
        </div>
        
        {/* Action Buttons - Consistent theme with different borders */}
        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-700">
          <button 
            onClick={onEdit}
            className="px-3 py-2 bg-gray-800 text-purple-400 rounded-md border border-purple-500 hover:bg-purple-900 hover:text-white transition-colors duration-200 flex items-center"
          >
            <FaEdit className="mr-1" /> Edit
          </button>
          <button 
            onClick={onDelete}
            className="px-3 py-2 bg-gray-800 text-gray-300 rounded-md border border-gray-600 hover:border-red-500 hover:text-red-400 transition-colors duration-200 flex items-center"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistCard; 