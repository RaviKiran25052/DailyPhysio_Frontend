import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  RiSearchLine, RiAddLine, RiEditLine, RiLockLine, RiLockUnlockLine,
  RiDeleteBinLine
} from 'react-icons/ri';
import { toast } from 'react-toastify';
import HandleExercise from '../../HandleExercise';
import MediaCarousel from '../../MediaCarousel';
import { SquareArrowOutUpRight } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

const ExerciseManagement = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('public');
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      const response = await axios.get(`${API_URL}/therapist/exercises`, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });
      setExercises(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setLoading(false);
    }
  };

  const handleToggleType = async (exerciseId, currentType) => {
    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      const newType = currentType === 'public' ? 'private' : 'public';

      await axios.put(
        `${API_URL}/exercises/${exerciseId}`,
        { custom: { type: newType } },
        {
          headers: { Authorization: `Bearer ${therapistInfo.token}` }
        }
      );

      setExercises(prev => prev.map(ex =>
        ex._id === exerciseId
          ? { ...ex, custom: { ...ex.custom, type: newType } }
          : ex
      ));

      toast.success(`Exercise made ${newType}`);
    } catch (error) {
      console.error('Error updating exercise type:', error);
      toast.error('Failed to update exercise type');
    }
  };

  const handleDelete = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;

    try {
      const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
      await axios.delete(`${API_URL}/exercises/${exerciseId}`, {
        headers: { Authorization: `Bearer ${therapistInfo.token}` }
      });

      setExercises(prev => prev.filter(ex => ex._id !== exerciseId));
      toast.success('Exercise deleted successfully');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Failed to delete exercise');
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = exercise.custom?.type === activeTab;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold">Exercise Management</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 w-64 text-white"
            />
          </div>
          <button
            onClick={() => {
              setSelectedExercise(null);
              setIsEdit(false);
              setShowExerciseModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RiAddLine />
            <span>Add Exercise</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('public')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'public'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
        >
          <RiLockUnlockLine className="inline-block mr-2" />
          Public Exercises
        </button>
        <button
          onClick={() => setActiveTab('private')}
          className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'private'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
        >
          <RiLockLine className="inline-block mr-2" />
          Private Exercises
        </button>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise._id}
            className="relative bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 overflow-hidden flex flex-col"
          >
            {/* Media carousel with overlay gradient */}
            <div className="relative h-48">
              <MediaCarousel images={exercise.image} video={exercise.video} />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />

              {/* Action buttons with tooltip effect */}
              <div className="absolute top-2 right-2 flex space-x-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExercise(exercise);
                    setIsEdit(true);
                    setShowExerciseModal(true);
                  }}
                  className="p-2 bg-gray-700/80 hover:bg-gray-600 text-white rounded-lg backdrop-blur-sm transform transition-transform hover:scale-110"
                  aria-label="Edit exercise"
                >
                  <RiEditLine className="text-purple-200" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(exercise._id);
                  }}
                  className="p-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg backdrop-blur-sm transform transition-transform hover:scale-110"
                  aria-label="Delete exercise"
                >
                  <RiDeleteBinLine className="text-red-100" />
                </button>
              </div>
            </div>

            {/* Content area with improved spacing and hover effects */}
            <div
              className="p-5 flex-1 flex flex-col cursor-pointer"
              onClick={() => navigate(`/exercise/${exercise._id}`, {
                state: {
                  isTherapist: true
                }
              })}
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-white group-hover:text-purple-300 transition">
                <span className="line-clamp-1">{exercise.title}</span>
                <SquareArrowOutUpRight size={16} className="text-purple-400 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </h3>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{exercise.description}</p>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-700/50">
                <div className="text-sm text-gray-400 flex items-center">
                  <span className="inline-block px-2 py-1 bg-gray-700/50 rounded-md text-purple-200 mr-2">
                    {exercise.category}
                  </span>
                  <span className="text-gray-500">
                    {exercise.subCategory}
                  </span>
                </div>

                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleType(exercise._id, exercise.custom?.type);
                    }}
                    className={`px-3 py-1 rounded-lg flex items-center gap-2 transition-colors ${exercise.custom?.type === 'public'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                      } text-white text-sm`}
                  >
                    {exercise.custom?.type === 'public'
                      ? <><RiLockUnlockLine className="text-purple-200" /> <span>Private</span></>
                      : <><RiLockLine className="text-gray-300" /> <span>Public</span></>
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No exercises found</div>
          <div className="text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first exercise'}
          </div>
        </div>
      )}

      {/* Exercise Modal */}
      {showExerciseModal && (
        <HandleExercise
          isOpen={showExerciseModal}
          onClose={() => {
            setShowExerciseModal(false);
            setSelectedExercise(null);
            setIsEdit(false);
          }}
          isEdit={isEdit}
          exercise={selectedExercise}
          token={JSON.parse(localStorage.getItem('therapistInfo'))?.token}
          onSuccess={fetchExercises}
        />
      )}
    </div>
  );
};

export default ExerciseManagement; 