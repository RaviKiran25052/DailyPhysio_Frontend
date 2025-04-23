import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const DeleteConfirmation = ({ therapist, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            Confirm Deletion
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete <span className="font-semibold text-white">{therapist.name}</span>? 
            This action cannot be undone.
          </p>
          
          <div className="bg-gray-700 rounded-md p-4 mb-6">
            <h3 className="text-white text-sm font-medium mb-2">Therapist Details:</h3>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-400">Email:</span> {therapist.email}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-400">Hospital/Clinic:</span> {therapist.hospital}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Therapist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation; 