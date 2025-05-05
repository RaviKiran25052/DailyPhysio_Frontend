import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Heart } from 'lucide-react';
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
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        // Get exercises created by this creator
        const response = await axios.get(`${API_URL}/exercises/creator/${creatorId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = response.data;
        console.log(data);

        setExercises(data.exercises);
        setCreatorName(data.creatorName.fullName)

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
    <div className="min-h-screen px-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header with back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-300 hover:text-purple-400 transition-colors mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl my-6 font-bold">{creatorName}'s Exercises</h1>

        {/* Categories filter */}
        {categories.length > 1 && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-2 rounded-md whitespace-nowrap ${activeCategory === 'all'
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
                  className={`px-3 py-2 rounded-md whitespace-nowrap ${activeCategory === category
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
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500 transition cursor-pointer"
                onClick={() => handleExerciseClick(exercise._id)}
              >
                {/* Media preview */}
                <div className="h-48 bg-gray-700">
                  {exercise.video?.length > 0 || exercise.image?.length > 0 ? (
                    <MediaCarousel videos={exercise.video || []} images={exercise.image || []} />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-700 text-gray-500">
                      <p>No media</p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-white">{exercise.title}</h3>

                    {/* Premium badge if applicable */}
                    {exercise.isPremium && (
                      <span className="bg-yellow-600 text-xs text-white px-2 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>

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
                  <div className="flex items-center text-gray-400 text-xs">
                    <div className="flex items-center mr-4">
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
          <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-8">
            <p className="text-gray-400 mb-4">No exercises found for this creator.</p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorExercisesPage; 