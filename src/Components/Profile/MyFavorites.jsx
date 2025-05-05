import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaCarousel from './MediaCarousel';
import axios from 'axios';
import { Link, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

const MyFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load favorites when component mounts
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFavorites(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites. Please try again later.');
      // If API isn't ready, use dummy data for demonstration
      if (process.env.NODE_ENV === 'development') {
        setFavorites(dummyFavorites);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    setDeleteLoading(id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/favorites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update state locally
      setFavorites(favorites.filter(favorite => favorite._id !== id));
      toast.success('Exercise removed from favorites');
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove from favorites');

      // If API isn't ready, just update UI for demonstration
      if (process.env.NODE_ENV === 'development') {
        setFavorites(favorites.filter(favorite => favorite._id !== id));
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };

  // Dummy data for development
  const dummyFavorites = [
    {
      _id: '1',
      title: 'Shoulder Mobilization Exercise',
      description: 'This exercise helps increase shoulder mobility and reduce stiffness in the joint.',
      instruction: "Start by standing with your arms at your sides. Slowly raise your arms forward, then upward, until they're pointing toward the ceiling.",
      video: [
        'https://filesamples.com/samples/video/mp4/sample_640x360.mp4',
        'https://filesamples.com/samples/video/mp4/sample_640x360.mp4'
      ],
      image: [
        'https://example.com/images/shoulder-mobility.jpg'
      ],
      category: 'Shoulder',
      subCategory: 'Mobility',
      position: 'Standing'
    },
    {
      _id: '2',
      title: 'Ankle Strengthening',
      description: 'Strengthens the muscles around the ankle to improve stability and prevent injuries.',
      instruction: 'Sit on a chair with your feet flat on the floor. Lift your toes while keeping your heels on the ground, then lower. Repeat 10 times.',
      video: [],
      image: [
        'https://example.com/images/ankle-strength1.jpg',
        'https://example.com/images/ankle-strength2.jpg',
        'https://example.com/images/ankle-strength3.jpg'
      ],
      category: 'Ankle and Foot',
      subCategory: 'Strengthening',
      position: 'Sitting'
    },
    {
      _id: '3',
      title: 'Lumbar Extension Exercise',
      description: 'Gentle extension exercise for the lumbar spine to relieve tension and improve mobility.',
      instruction: 'Lie face down with your hands positioned under your shoulders. Gently push up, lifting your upper body while keeping your hips on the ground.',
      video: ['https://example.com/videos/lumbar-extension.mp4'],
      image: [],
      category: 'Lumbar Thoracic',
      subCategory: 'Extension',
      position: 'Prone'
    }
  ];

  if (loading) {
    return (
      <div className="bg-gray-900 p-8 text-center">
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-8 w-8 text-purple-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-purple-400">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 p-8 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchFavorites} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 shadow-lg overflow-hidden min-h-screen">
      {/* Page Title */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          My Favorites
        </h1>
      </div>

      {/* Favorites List */}
      <div className="p-6">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map(favorite => (
              <div
                key={favorite._id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500 transition duration-300"
              >
                {/* Media Carousel - Fixed height to match your second image */}
                {(favorite.video?.length > 0 || favorite.image?.length > 0) && (
                  <div className="h-48 relative">
                    <MediaCarousel videos={favorite.video || []} images={favorite.image || []} />
                  </div>
                )}

                {/* Content Area */}
                <div className="p-5">
                  {/* Header with Title and Favorite Button */}
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="font-medium flex gap-2 text-white text-lg hover:text-purple-300 cursor-pointer transition"
                      onClick={() => handleExerciseClick(favorite._id)}
                    >
                      {favorite.title}<SquareArrowOutUpRight size={14} />
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(favorite._id);
                      }}
                      className="p-2 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition"
                      aria-label="Remove from favorites"
                      disabled={deleteLoading === favorite._id}
                    >
                      {deleteLoading === favorite._id ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <div className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {favorite.description}
                  </div>

                  {/* Category and Subcategory */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-700 p-2 rounded-md">
                      <span className="text-purple-300 text-xs font-medium block mb-1">Category</span>
                      <p className="text-white text-sm">{favorite.category}</p>
                    </div>
                    <div className="bg-gray-700 p-2 rounded-md">
                      <span className="text-purple-300 text-xs font-medium block mb-1">Subcategory</span>
                      <p className="text-white text-sm">{favorite.subCategory}</p>
                    </div>
                  </div>

                  {/* Position Badge */}
                  <div className="inline-block bg-purple-600 px-3 py-1 rounded-full text-sm text-white">
                    {favorite.position}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-purple-400 italic mb-6">You haven't added any favorites yet</p>
            <button onClick={() => navigate('/exercises')} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
              Browse Exercises
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyFavorites;