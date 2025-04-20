import React from 'react';
import { Info, Plus, Check } from 'lucide-react';

const ExerciseCard = ({
  exercise,
  layoutSize = 'medium',
  onViewDetails,
  addExerciseToHEP,
  isInHEP = false
}) => {
  // Handle view details click
  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent the card click event
    if (onViewDetails) {
      onViewDetails(exercise);
    } else {
      console.log(exercise);
    }
  };

  // Handle add to HEP
  const handleAddToHEP = (e) => {
    e.stopPropagation();
    if (addExerciseToHEP && !isInHEP) {
      addExerciseToHEP(exercise);
    }
  };

  // Determine image height based on layout size
  const getImageHeight = () => {
    // For mobile carousel view, use a consistent height
    if (window.innerWidth < 768) {
      return 'h-40';
    }
    
    // For desktop, adjust based on layout size
    switch (layoutSize) {
      case 'small':
        return 'h-32';
      case 'large':
        return 'h-56';
      case 'medium':
      default:
        return 'h-44';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-700">
      <div className={`relative ${getImageHeight()} overflow-hidden bg-gray-700`}>
        <img
          src={exercise.image || "https://via.placeholder.com/800x600?text=Exercise+Image"}
          alt={exercise.title || exercise.name || "Exercise"}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Add to HEP button - positioned at the top-right */}
        <button
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${isInHEP
              ? 'bg-purple-600 text-white cursor-not-allowed'
              : 'bg-gray-800/80 text-white hover:bg-purple-600/80'
            }`}
          onClick={handleAddToHEP}
          disabled={isInHEP}
          title={isInHEP ? "Already added to HEP" : "Add to HEP"}
        >
          {isInHEP ? <Check size={18} /> : <Plus size={18} />}
        </button>
      </div>
      
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2 text-white line-clamp-1">
          {exercise.title || exercise.name || "Unnamed Exercise"}
        </h3>
        
        {/* Make categories and positions visible on all screens */}
        <div className="mb-2 flex flex-wrap gap-1">
          {exercise.category && (
            <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {exercise.category}
            </span>
          )}
          {exercise.position && (
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {exercise.position || "Any Position"}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-3 flex-grow">
          {exercise.description || "No description available."}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <button
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors duration-200 p-1 rounded-md hover:bg-gray-700/50"
            onClick={handleViewDetails}
          >
            <Info size={16} />
            <span>Details</span>
          </button>
          
          {/* Mobile-only button for adding to HEP */}
          <button
            className={`md:hidden flex items-center gap-1 p-1 rounded-md ${isInHEP
                ? 'text-purple-300 bg-purple-900/20'
                : 'text-gray-400 hover:text-purple-300 hover:bg-gray-700/50'
              } transition-colors duration-200`}
            onClick={handleAddToHEP}
            disabled={isInHEP}
          >
            {isInHEP ? <Check size={16} /> : <Plus size={16} />}
            <span>{isInHEP ? "Added" : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard; 