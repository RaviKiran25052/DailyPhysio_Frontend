import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaCarousel from './MediaCarousel';
import axios from 'axios';
import { Link, SquareArrowOutUpRight, Trash2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

const MyFavorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load favorites when component mounts
    fetchFavorites();
    
    // For development, comment out the API call above and use this instead:
    setFavorites(dummyFavorites);
    setLoading(false);
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      /*
      // Actual API call - commented out for development
      const response = await axios.get(`${API_URL}/api/favorites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavorites(response.data);
      */
      
      // Using dummy data instead
      setFavorites(dummyFavorites);
      setError(null);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id) => {
    try {
      /*
      // Actual API call - commented out for development
      await axios.delete(`${API_URL}/api/favorites/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      */
      
      // Update state locally
      setFavorites(favorites.filter(favorite => favorite._id !== id));
    } catch (err) {
      console.error('Error removing favorite:', err);
      // You might want to show an error message to the user
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
        <p className="text-purple-400">Loading your favorites...</p>
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
                {/* Media Carousel */}
                {(favorite.video.length > 0 || favorite.image.length > 0) && (
                  <MediaCarousel videos={favorite.video} images={favorite.image} />
                )}
                
                {/* Content Area */}
                <div className="p-5">
                  {/* Header with Title and Favorite Button */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 
                      className="font-medium flex gap-2 text-white text-lg hover:text-purple-300 cursor-pointer transition"
                      onClick={() => handleExerciseClick(favorite._id)}
                    >
                      {favorite.title}<SquareArrowOutUpRight size={14}/>
                    </h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(favorite._id);
                      }}
                      className="p-2 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 size={16} />
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