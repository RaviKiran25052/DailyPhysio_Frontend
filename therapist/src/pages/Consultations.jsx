import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RiSearchLine, RiAddLine, RiCalendarLine, RiUserLine,
  RiArrowLeftLine, RiRunLine, RiInformationLine, RiCloseLine,
  RiDeleteBinLine
} from 'react-icons/ri';
import AddConsultation from '../components/AddConsultation';

const API_URL = process.env.REACT_APP_API_URL;

const ExerciseSelector = ({ onSelect, onClose, selectedExercises }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
        const response = await axios.get(`${API_URL}/exercises`, {
          headers: { Authorization: `Bearer ${therapistInfo.token}` }
        });
        setExercises(Array.isArray(response.data) ? response.data : response.data.exercises || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setExercises([]);
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(exercise => {
    if (!exercise) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (exercise.title?.toLowerCase().includes(searchLower) || false) &&
      !selectedExercises.includes(exercise._id)
    );
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Select Exercises</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <RiCloseLine size={24} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 rounded-lg"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise._id}
              className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600"
              onClick={() => onSelect(exercise._id)}
            >
              <img
                src={exercise.image[0]}
                alt={exercise.title}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <h4 className="font-medium">{exercise.title}</h4>
              <div className="text-sm text-gray-400">
                {exercise.category} - {exercise.subCategory}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, patient, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Delete Consultation</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the consultation with {patient}? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ConsultationDetails = ({ consultation, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeDays, setActiveDays] = useState(getDateDifference(consultation.request?.expiresOn));
  const [notes, setNotes] = useState(consultation.notes || '');
  const [recommendedExercises, setRecommendedExercises] = useState(consultation.recommendedExercises || []);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  function getDateDifference(expiresOn) {
    const expiresDate = new Date(expiresOn);
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const expiresMidnight = new Date(expiresDate.getFullYear(), expiresDate.getMonth(), expiresDate.getDate());
    const diffTime = expiresMidnight - todayMidnight;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  const handleSave = async () => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));

      const response = await axios.put(
        `${API_URL}/therapist/consultations/${consultation._id}`,
        {
          activeDays,
          desp: notes,
          recommendedExercises
        },
        {
          headers: { Authorization: `Bearer ${therapistInfo.token}` }
        }
      );

      if (response.data) {
        setIsEditing(false);
        if (onUpdate) onUpdate(response.data);
      }
    } catch (error) {
      console.error('Error updating consultation:', error);
    }
  };

  const handleCancel = () => {
    setActiveDays(getDateDifference(consultation.request?.expiresOn));
    setNotes(consultation.notes || '');
    setRecommendedExercises(consultation.recommendedExercises);
    setIsEditing(false);
  };

  const handleRemoveExercise = (exerciseId) => {
    setRecommendedExercises(prev => prev.filter(ex => ex._id !== exerciseId));
  };

  const handleAddExercise = async (exerciseId) => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      const response = await axios.get(`${API_URL}/therapist/exercises`, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });

      const exercise = response.data.find(ex => ex._id === exerciseId);
      if (exercise) {
        setRecommendedExercises(prev => [...prev, exercise]);
      }
      setShowExerciseSelector(false);
    } catch (error) {
      console.error('Error fetching exercise details:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      await axios.delete(
        `${API_URL}/therapist/consultations/${consultation._id}`,
        {
          headers: { Authorization: `Bearer ${therapistInfo.token}` }
        }
      );
      onBack();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting consultation:', error);
    }
  };

  return (
    <div className="animate-fadeIn">
      {showExerciseSelector && (
        <ExerciseSelector
          onSelect={handleAddExercise}
          onClose={() => setShowExerciseSelector(false)}
          selectedExercises={recommendedExercises.map(ex => ex._id)}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        patient={consultation.patient_id.fullName}
        onConfirm={handleDelete}
      />

      <div className="flex justify-between items-center mx-6 mt-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 border-2 border-gray-500 p-2 rounded-md"
        >
          <RiArrowLeftLine size={20} />
          <span>Back to Consultations</span>
        </button>
      </div>

      <div className="p-6 text-white">
        <div className="bg-primary-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <RiUserLine className="mr-2 text-primary-500" />
            Patient Information
          </h3>
          <div className='flex justify-between items-center'>
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
            {isEditing ? (
              <div className="space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className='flex items-center space-x-4'>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="flex items-center space-x-2 text-red-400 hover:text-white border border-red-400 hover:border-white p-2 rounded-md"
                >
                  <RiDeleteBinLine size={20} />
                  <span>Delete Consultation</span>
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-primary-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RiCalendarLine className="mr-2 text-primary-500" />
              Duration
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-gray-400">Created On</div>
                <div className="font-medium">
                  {new Date(consultation.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Active Days</div>
                {isEditing ? (
                  <input
                    type="number"
                    value={Math.max(activeDays, 0)}
                    onChange={(e) => setActiveDays(parseInt(e.target.value))}
                    className="w-24 px-2 py-1 bg-primary-700 rounded border border-gray-600"
                    min="1"
                  />
                ) : (
                  <div className="font-medium">{activeDays > 0 ? `${activeDays} days` : `deactivated ${Math.abs(activeDays)} days back`}</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-primary-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <RiInformationLine className="mr-2 text-primary-500" />
              Notes
            </h3>
            {isEditing ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 px-3 py-2 bg-primary-700 rounded border border-gray-600 resize-none"
                placeholder="Add notes here..."
              />
            ) : (
              <p className="text-gray-300">{notes || 'No notes provided'}</p>
            )}
          </div>
        </div>

        <div className="bg-primary-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <RiRunLine className="mr-2 text-primary-500" />
              Recommended Exercises
            </h3>
            {isEditing && (
              <button
                onClick={() => setShowExerciseSelector(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <RiAddLine />
                <span>Add Exercise</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedExercises.map((exercise) => (
              <div key={exercise._id} className="bg-primary-700 rounded-lg p-4 relative">
                {isEditing && (
                  <button
                    onClick={() => handleRemoveExercise(exercise._id)}
                    className="absolute -top-2 -right-2 rounded-md text-white bg-red-500 hover:bg-red-600"
                  >
                    <RiCloseLine size={20} />
                  </button>
                )}
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
                  <span className="text-primary-400">Sets:</span> {exercise.set} |
                  <span className="text-primary-400"> Reps:</span> {exercise.reps} |
                  <span className="text-primary-400"> Hold:</span> {exercise.hold}s
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (selectedConsultation) {
    return <ConsultationDetails
      consultation={selectedConsultation}
      onBack={() => setSelectedConsultation(null)}
      onUpdate={fetchConsultations}
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
              className="pl-10 pr-4 py-2 bg-primary-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 w-64 text-white"
            />
          </div>
          <button
            onClick={() => setShowAddConsultation(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
            className="bg-primary-800 rounded-xl text-white transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedConsultation(consultation)}
          >
            <div className="p-6">

              {/* Patient Info */}
              <div className="flex justify-between items-start mb-4">
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
                <span className={`px-2 rounded-full text-sm font-semibold ${consultation.request.status === 'active'
                  ? 'bg-green-500 text-green-900'
                  : 'bg-yellow-500 text-yellow-900'
                  }`}>
                  {consultation.request.status}
                </span>
              </div>

              {/* Date Info */}
              <div className="flex items-center space-x-3 mb-4">
                <RiCalendarLine className="text-primary-400" size={20} />
                <div>
                  <div className="text-sm text-gray-400">Created</div>
                  <div className="font-medium">{new Date(consultation.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Exercise Count */}
              <div className="flex items-center space-x-3 mb-4">
                <RiRunLine className="text-primary-400" size={20} />
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
              <button className="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
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