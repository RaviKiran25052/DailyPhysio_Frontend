import React, { useState, useEffect } from 'react';
import { X, Trash2, AlertCircle } from 'lucide-react';

const ExerciseFooter = ({ selectedExercises, removeExercise, clearExercises }) => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  const [showLimit, setShowLimit] = useState(false);

  useEffect(() => {
    // Show footer when there are selected exercises
    setIsFooterVisible(selectedExercises.length > 0);
    
    // Check if user has pro subscription
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        setIsProUser(parsedInfo.membershipType === 'pro');
      } catch (e) {
        setIsProUser(false);
      }
    }
    
    // Show limit warning for non-pro users with more than one exercise
    setShowLimit(!isProUser && selectedExercises.length > 1);
  }, [selectedExercises, isProUser]);

  if (!isFooterVisible) return null;

  return (
    <div className="bg-gray-800 border-t border-gray-700 shadow-lg z-10 mt-6">
      {showLimit && (
        <div className="bg-yellow-600 text-white text-sm px-4 py-2 flex items-center justify-center gap-2">
          <AlertCircle size={16} />
          <span>Free users can only add 1 exercise to HEP. Upgrade to Pro for unlimited exercises.</span>
        </div>
      )}
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-medium">
              HEP Editor <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">{selectedExercises.length}</span>
            </h3>
            <button 
              onClick={clearExercises}
              className="flex items-center space-x-1 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md hover:bg-gray-700"
            >
              <Trash2 size={16} />
              <span className="text-sm">Clear All</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {selectedExercises.map((exercise, index) => (
              <div 
                key={exercise.id || exercise._id} 
                className="flex bg-gray-700 rounded-md overflow-hidden relative"
              >
                {/* Delete button */}
                <button 
                  onClick={() => removeExercise(exercise.id || exercise._id)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-gray-900/50 hover:bg-red-600/70 text-white"
                  aria-label="Remove exercise"
                >
                  <X size={14} />
                </button>
                
                {/* Exercise image */}
                <div className="w-20 h-full flex-shrink-0">
                  <img 
                    src={exercise.image || "https://via.placeholder.com/100?text=Exercise"} 
                    alt={exercise.title || exercise.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Exercise details */}
                <div className="flex-1 p-2 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {index + 1}. {exercise.title || exercise.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-xs bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded-full truncate">
                      {exercise.category}
                    </span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded-full truncate">
                      {exercise.position || "Any Position"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(124, 58, 237, 0.5) rgba(31, 41, 55, 0.5);
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(124, 58, 237, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default ExerciseFooter; 