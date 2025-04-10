import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const MyFavorites = ({ userData }) => {
  // Mock data for favorite exercises
  const [favorites, setFavorites] = useState([
    { id: 1, name: "Shoulder External Rotation", target: "Rotator Cuff", addedDate: "1 week ago" },
    { id: 2, name: "Hip Abduction", target: "Hip Abductors", addedDate: "2 weeks ago" },
    { id: 3, name: "Thoracic Extension", target: "Upper Back", addedDate: "3 days ago" }
  ]);
  
  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };
  
  return (
    <div className="bg-gray-900 shadow-lg overflow-hidden">
      {/* Page Title */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          My Favorites
        </h1>
      </div>

      {/* Single Tab */}
      <div className="flex border-b border-gray-800">
        <div className="flex-1 py-3 px-4 text-center text-purple-400 border-b-2 border-purple-500">
          My Favorite Exercises
        </div>
      </div>

      {/* Favorites List */}
      <div className="p-6">
        {favorites.length > 0 ? (
          <div className="grid gap-4">
            {favorites.map(favorite => (
              <div key={favorite.id} className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white">{favorite.name}</h3>
                  <p className="text-sm text-gray-400">Target: {favorite.target}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-4">Added {favorite.addedDate}</span>
                  <button 
                    onClick={() => removeFavorite(favorite.id)}
                    className="p-1.5 rounded-full text-red-400 hover:bg-red-600 hover:text-white transition"
                  >
                    <FaHeart size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-purple-400 italic mb-6">You haven't added any favorites yet</p>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
              Browse Exercises
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites; 