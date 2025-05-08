import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RiSearchLine, RiAddLine, RiCalendarLine, RiUserLine,
  RiArrowLeftLine, RiRunLine, RiInformationLine
} from 'react-icons/ri';
import AddConsultation from './AddConsultation';

const API_URL = process.env.REACT_APP_API_URL;

const ConsultationDetails = ({ consultation, onBack }) => {
  return (
    <div className="animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-400 hover:text-white m-6 border border-gray-400 p-2 rounded-md"
      >
        <RiArrowLeftLine size={20} />
        <span>Back to Consultations</span>
      </button>

      <div className=" p-6">
        {/* Patient Information */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <RiUserLine className="mr-2 text-purple-500" />
            Patient Information
          </h3>
          <div className="flex items-center space-x-4">
            <img
              src={consultation.patient_id.profileImage}
              alt={consultation.patient_id.fullName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-lg">
                {consultation.patient_id.fullName}
                <span className={`px-3 py-1 ml-4 rounded-full text-base ${consultation.request.status === 'active'
                  ? 'bg-green-500 bg-opacity-20 text-green-500'
                  : 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                  }`}>
                  {consultation.request.status}
                </span>
              </div>
              <div className="text-gray-400">{consultation.patient_id.email}</div>
            </div>
          </div>
        </div>

        {/* Consultation Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RiCalendarLine className="mr-2 text-purple-500" />
              Duration
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-gray-400">Created On</div>
                <div className="font-medium">{new Date(consultation.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
              </div>
              <div>
                <div className="text-gray-400">Active Days</div>
                <div className="font-medium">{consultation.request.activeDays} days</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RiInformationLine className="mr-2 text-purple-500" />
              Notes
            </h3>
            <p className="text-gray-300">{consultation.notes || 'No notes provided'}</p>
          </div>
        </div>

        {/* Recommended Exercises */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <RiRunLine className="mr-2 text-purple-500" />
            Recommended Exercises
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultation.recommendedExercises.map((exercise) => (
              <div key={exercise._id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <img
                  src={exercise.image[0]}
                  alt={exercise.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium mb-2">{exercise.title}</h4>
                <div className="text-sm text-gray-400 mb-2">
                  {exercise.category} - {exercise.subCategory}
                </div>
                <div className="text-sm">
                  <span className="text-purple-500">Sets:</span> {exercise.set} |
                  <span className="text-purple-500"> Reps:</span> {exercise.reps} |
                  <span className="text-purple-500"> Hold:</span> {exercise.hold}s
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showAddConsultation, setShowAddConsultation] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      const response = await axios.get(`${API_URL}/therapist/consultations`, {
        headers: {
          Authorization: `Bearer ${therapistInfo.token}`
        }
      });

      setConsultations(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setLoading(false);
    }
  };
  const filteredConsultations = consultations.filter(consultation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      consultation.patient_id.fullName.toLowerCase().includes(searchLower) ||
      consultation.notes?.toLowerCase().includes(searchLower) ||
      consultation.patient_id.email.toLowerCase().includes(searchLower)
    );
  });

  const handleAddSuccess = () => {
    fetchConsultations(); // Refresh the consultations list
    setShowAddConsultation(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (selectedConsultation) {
    return <ConsultationDetails
      consultation={selectedConsultation}
      onBack={() => setSelectedConsultation(null)}
    />;
  }

  return (
    <div className="p-6">
      {showAddConsultation && (
        <AddConsultation
          onClose={() => setShowAddConsultation(false)}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold">Consultations</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 w-64 text-white"
            />
          </div>
          <button
            onClick={() => setShowAddConsultation(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RiAddLine />
            <span>New Consultation</span>
          </button>
        </div>
      </div>

      {/* Consultations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultations.map((consultation) => (
          <div
            key={consultation._id}
            className="bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedConsultation(consultation)}
          >
            <div className="p-6">

              {/* Patient Info */}
              <div className="flex justify-between items-center mb-4">
                <div className='flex items-center space-x-4'>
                  <img
                    src={consultation.patient_id.profileImage}
                    alt={consultation.patient_id.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{consultation.patient_id.fullName}</div>
                    <div className="text-sm text-gray-400">{consultation.patient_id.email}</div>
                  </div>
                </div>
                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-sm ${consultation.request.status === 'active'
                  ? 'bg-green-500 bg-opacity-20 text-green-500'
                  : 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                  }`}>
                  {consultation.request.status}
                </span>
              </div>

              {/* Date Info */}
              <div className="flex items-center space-x-3 mb-4">
                <RiCalendarLine className="text-purple-500" size={20} />
                <div>
                  <div className="text-sm text-gray-400">Created</div>
                  <div className="font-medium">{new Date(consultation.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Exercise Count */}
              <div className="flex items-center space-x-3 mb-4">
                <RiRunLine className="text-purple-500" size={20} />
                <div>
                  <div className="text-sm text-gray-400">Exercises</div>
                  <div className="font-medium">{consultation.recommendedExercises.length} assigned</div>
                </div>
              </div>

              {/* Notes Preview */}
              {consultation.notes && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Notes</div>
                  <p className="text-sm line-clamp-2">{consultation.notes}</p>
                </div>
              )}

              {/* View Details Button */}
              <button className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredConsultations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No consultations found</div>
          <div className="text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first consultation'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;