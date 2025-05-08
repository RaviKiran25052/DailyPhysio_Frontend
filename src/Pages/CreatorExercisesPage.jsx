import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Eye, 
  Heart, 
  MapPin, 
  Mail, 
  Phone, 
  Users, 
  Briefcase, 
  Clock, 
  Award,
  Star,
  Tag
} from 'lucide-react';
import axios from 'axios';
import MediaCarousel from '../Components/Profile/MediaCarousel';

const API_URL = process.env.REACT_APP_API_URL || '';

const CreatorExercisesPage = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [creatorData, setCreatorData] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/exercises/creator/${creatorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = response.data;
        setExercises(data.exercises);
        setCreatorData(data.creatorData);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.exercises.map(ex => ex.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching creator exercises:', err);
        setError('Failed to load exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [creatorId]);

  // Filter exercises by category
  const filteredExercises = activeCategory === 'all'
    ? exercises
    : exercises.filter(ex => ex.category === activeCategory);

  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center">
          <svg className="animate-spin h-8 w-8 text-purple-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto">
        <div className="flex gap-6">
          {/* Left Sidebar - Creator Details */}
          <div className="w-1/4 min-w-[300px] p-6 sticky top-0 h-screen overflow-y-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-300 hover:text-purple-400 transition-colors mb-6"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>Back</span>
            </button>

            {creatorData && (
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <img
                    src={creatorData.profileImage || '/default-avatar.png'}
                    alt={creatorData.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {creatorData.role || 'Creator'}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {creatorData.name || creatorData.fullName}
                  </h1>
                  {creatorData.specialization && (
                    <p className="text-purple-400 text-sm mb-3">{creatorData.specialization}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Exercises</span>
                      <Tag size={16} className="text-purple-400" />
                    </div>
                    <p className="text-xl font-semibold mt-1">{exercises.length}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Rating</span>
                      <Star size={16} className="text-purple-400" />
                    </div>
                    <p className="text-xl font-semibold mt-1">{creatorData.rating || '4.5'}/5</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Followers</span>
                      <Users size={16} className="text-purple-400" />
                    </div>
                    <p className="text-xl font-semibold mt-1">{creatorData.followers || 0}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Experience</span>
                      <Clock size={16} className="text-purple-400" />
                    </div>
                    <p className="text-xl font-semibold mt-1">{creatorData.experience || '5+ years'}</p>
                  </div>
                </div>

                {/* Contact & Additional Info */}
                <div className="space-y-4">
                  {creatorData.workingAt && (
                    <div className="flex items-center text-gray-300">
                      <Briefcase size={18} className="mr-3 text-purple-400" />
                      <span>{creatorData.workingAt}</span>
                    </div>
                  )}
                  {creatorData.address && (
                    <div className="flex items-center text-gray-300">
                      <MapPin size={18} className="mr-3 text-purple-400" />
                      <span>{creatorData.address}</span>
                    </div>
                  )}
                  {creatorData.email && (
                    <div className="flex items-center text-gray-300">
                      <Mail size={18} className="mr-3 text-purple-400" />
                      <span>{creatorData.email}</span>
                    </div>
                  )}
                  {creatorData.phoneNumber && (
                    <div className="flex items-center text-gray-300">
                      <Phone size={18} className="mr-3 text-purple-400" />
                      <span>{creatorData.phoneNumber}</span>
                    </div>
                  )}
                </div>

                {/* Achievements/Specializations */}
                {creatorData.specializations && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Award size={18} className="mr-2 text-purple-400" />
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {creatorData.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="bg-purple-900/40 text-purple-200 text-xs px-2 py-1 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Content - Exercises Grid */}
          <div className="flex-1 py-6 pr-6 overflow-y-auto">
            {/* Categories filter */}
            {categories.length > 1 && (
              <div className="mb-6">
                <div className="flex space-x-2 pb-2">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-2 rounded-md whitespace-nowrap ${
                      activeCategory === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-2 rounded-md whitespace-nowrap ${
                        activeCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Exercises grid */}
            {filteredExercises.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map(exercise => (
                  <div
                    key={exercise._id}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500 transition cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
                    onClick={() => handleExerciseClick(exercise._id)}
                  >
                    {/* Media preview */}
                    <div className="h-48 bg-gray-700 relative">
                      {exercise.video?.length > 0 || exercise.image?.length > 0 ? (
                        <MediaCarousel video={exercise.video || []} images={exercise.image || []} />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-700 text-gray-500">
                          <p>No media</p>
                        </div>
                      )}
                      {exercise.isPremium && (
                        <div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
                          Premium
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-white mb-2 line-clamp-1">{exercise.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{exercise.description}</p>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-purple-900/60 text-purple-300 text-xs px-2 py-1 rounded-full">
                          {exercise.category}
                        </span>
                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                          {exercise.position}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-gray-400 text-xs pt-3 border-t border-gray-700">
                        <div className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          <span>{exercise.views || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart size={14} className="mr-1" />
                          <span>{exercise.favorites || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-4">No exercises found in this category.</p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
                >
                  View All Exercises
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorExercisesPage; 