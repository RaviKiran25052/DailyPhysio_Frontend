import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Eye,
  Heart,
  MapPin,
  Mail,
  Phone,
  Users,
  Briefcase,
  Clock,
  Tag
} from 'lucide-react';
import axios from 'axios';
import MediaCarousel from '../components/Exercises/MediaCarousel';
import ExerciseCarousel from '../components/Exercises/ExerciseCarousel';

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
  const [isMobile, setIsMobile] = useState(false);

  // Current exercise index for mobile carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayTimeout, setAutoplayTimeout] = useState(null);

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
        if (data.creatorData.role === "isAdmin") {
          navigate("/exercises/")
        }

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

    // Check for mobile view
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [creatorId]);

  // Filter exercises by category
  const filteredExercises = activeCategory === 'all'
    ? exercises
    : exercises.filter(ex => ex.category === activeCategory);

  useEffect(() => {
    // Reset current index when category changes
    setCurrentIndex(0);
  }, [activeCategory]);

  // Setup autoplay for mobile
  useEffect(() => {
    // Only set up autoplay if we're in mobile view
    if (!isMobile) return;

    // Clear previous timeout when changing exercises
    if (autoplayTimeout) {
      clearTimeout(autoplayTimeout);
    }

    if (filteredExercises.length > 1) {
      const timeout = setTimeout(() => {
        nextExercise();
      }, 3000);
      setAutoplayTimeout(timeout);
    }

    return () => {
      if (autoplayTimeout) {
        clearTimeout(autoplayTimeout);
      }
    };
  }, [currentIndex, filteredExercises, isMobile]);

  // Navigation functions for mobile carousel
  const nextExercise = () => {
    if (filteredExercises.length <= 1) return;

    setCurrentIndex(prevIndex => {
      if (prevIndex >= filteredExercises.length - 1) {
        return 0; // Loop back to the first exercise
      } else {
        return prevIndex + 1;
      }
    });
  };

  const prevExercise = () => {
    if (filteredExercises.length <= 1) return;

    setCurrentIndex(prevIndex => {
      if (prevIndex <= 0) {
        return filteredExercises.length - 1; // Loop to the last exercise
      } else {
        return prevIndex - 1;
      }
    });
  };

  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center">
          <svg className="animate-spin h-8 w-8 text-primary-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Left Sidebar - Creator Details */}
          <div className="w-full lg:w-1/4 p-4 lg:p-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            {creatorData && (
              <div className="bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg border border-gray-700">
                {/* Basic Info */}
                <div className="mb-5">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Dr. {creatorData.name}
                  </h1>
                  {creatorData.specializations && (
                    <p className="text-primary-400 text-sm mb-3">{creatorData?.specializations?.join(" | ")}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-2 mb-5 text-sm">
                  <div className="bg-gray-700/50 p-2 rounded-lg flex justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-primary-400" />
                      <span className="text-gray-400">Exercises</span>
                    </div>
                    <p className="font-semibold mt-1">{exercises.length}</p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg flex justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase size={16} className="text-primary-400" />
                      <span className="text-gray-400">Consultations</span>
                    </div>
                    <p className="font-semibold mt-1">{creatorData.consultationCount || 0}</p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg flex justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-primary-400" />
                      <span className="text-gray-400">Followers</span>
                    </div>
                    <p className="font-semibold mt-1">{creatorData.followers || 0}</p>
                  </div>
                  <div className="bg-gray-700/50 p-2 rounded-lg flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-primary-400" />
                      <span className="text-gray-400">Experience</span>
                    </div>
                    <p className="font-semibold mt-1">{creatorData.experience || '5+ years'}</p>
                  </div>
                </div>

                {/* Contact & Additional Info */}
                <div className="space-y-4 text-sm">
                  {creatorData.workingAt && (
                    <div className="flex items-center text-gray-300">
                      <Briefcase size={18} className="mr-3 text-primary-400" />
                      <span>{creatorData.workingAt}</span>
                    </div>
                  )}
                  {creatorData.address && (
                    <div className="flex items-center text-gray-300">
                      <MapPin size={18} className="mr-3 text-primary-400" />
                      <span>{creatorData.address}</span>
                    </div>
                  )}
                  {creatorData.email && (
                    <div className="flex items-center text-gray-300">
                      <Mail size={18} className="mr-3 text-primary-400" />
                      <span>{creatorData.email}</span>
                    </div>
                  )}
                  {creatorData.phoneNumber && (
                    <div className="flex items-center text-gray-300">
                      <Phone size={18} className="mr-3 text-primary-400" />
                      <span>{creatorData.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Exercises Display */}
          <div className="w-full lg:flex-1 p-4 lg:py-6 lg:pr-6">
            {/* Categories filter */}
            {categories.length > 1 && (
              <div className="mb-5">
                <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-2 rounded-md whitespace-nowrap ${activeCategory === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-2 rounded-md whitespace-nowrap ${activeCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredExercises.length > 0 ? (
              <>
                {/* Desktop Grid Layout */}
                {!isMobile && (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-gray-500">
                        {activeCategory === 'all' ? 'All Exercises' : activeCategory}
                      </span>
                      <div className="h-1 w-16 bg-gradient-to-r from-primary-600 to-gray-500 mt-2"></div>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {filteredExercises.map(exercise => (
                        <div
                          key={exercise._id}
                          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-primary-500 transition cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
                          onClick={() => handleExerciseClick(exercise._id)}
                        >
                          {/* Media preview */}
                          <div className="h-40 sm:h-48 bg-gray-700 relative">
                            {exercise.video != null || exercise.image?.length > 0 ? (
                              <MediaCarousel video={exercise.video || null} images={exercise.image || []} />
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
                              <span className="bg-primary-900/60 text-primary-300 text-xs px-2 py-1 rounded-full">
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
                  </>
                )}

                {/* Mobile Carousel Layout */}
                {isMobile && (
                  <div className="mb-6">
                    {/* Exercise Counter */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-gray-500">
                          {activeCategory === 'all' ? 'All Exercises' : activeCategory}
                        </span>
                        <div className="h-1 w-16 bg-gradient-to-r from-primary-600 to-gray-500 mt-2"></div>
                      </h2>
                      <div className="text-gray-400">
                        Exercise {currentIndex + 1} of {filteredExercises.length}
                      </div>
                    </div>

                    <ExerciseCarousel
                      exercises={filteredExercises}
                      onExerciseClick={handleExerciseClick}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800 rounded-xl p-8 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-4">No exercises found in this category.</p>
                <button
                  onClick={() => navigate('/exercises')}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition"
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