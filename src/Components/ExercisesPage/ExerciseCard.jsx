import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, Plus } from 'lucide-react';
import { useExerciseContext } from '../../context/ExerciseContext';

const ExerciseCard = ({ 
  exercise, 
  layoutSize = 'medium', 
  initialSelected = false, 
  onSelect,
  onViewDetails
}) => {
  const navigate = useNavigate();
  const { addExercise, selectedExercises } = useExerciseContext();
  
  // Image size based on layout
  const getImageSize = () => {
    switch(layoutSize) {
      case 'small': return 'h-32';
      case 'large': return 'h-64';
      default: return 'h-48';
    }
  };

  // Check if this exercise is already selected
  const isSelected = selectedExercises.some(item => item.id === exercise.id);

  // Handle view details click
  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent the card click event
    if (onViewDetails) {
      onViewDetails(exercise);
    } else {
      navigate(`/exercise/${exercise.id}`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="relative h-44 overflow-hidden bg-gray-700">
        <img
          src={exercise.image || "https://via.placeholder.com/800x600?text=Exercise+Image"}
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold mb-2 flex-1">{exercise.name}</h3>
          <button 
            className={`p-1.5 rounded-full ${
              isSelected 
                ? 'bg-purple-600 text-white cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-purple-600'
            }`}
            onClick={() => !isSelected && addExercise(exercise)}
            disabled={isSelected}
            title={isSelected ? "Already added" : "Add to plan"}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {exercise.categories?.map((category, index) => (
            <span key={index} className="text-xs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full">
              {category}
            </span>
          ))}
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
            {exercise.position || "Any Position"}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-3 flex-grow">
          {exercise.description || "No description available."}
        </p>
      </div>
      <div className="p-4 pt-0 flex justify-end">
        <button 
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
          onClick={handleViewDetails}
        >
          <Info size={16} />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard; 