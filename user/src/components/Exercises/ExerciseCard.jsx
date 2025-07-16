import { Crown, SquareArrowOutUpRight } from 'lucide-react';
import MediaCarousel from './MediaCarousel';

const ExerciseCard = ({
  exercise,
  layoutSize = 'medium',
  onViewDetails,
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

  // Determine image height based on layout size
  const getLayout = () => {
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
      <div className={`relative ${getLayout()} overflow-hidden bg-gray-700`}>
        <MediaCarousel images={exercise.image} video={exercise.video} />
        {exercise.isPremium &&
          <div className='absolute top-2 left-2 bg-yellow-500 rounded-md z-10 p-1'>
            <Crown size={16} className='text-gray-800' />
          </div>
        }
      </div>

      <div className="p-3 flex flex-col">
        <h3 onClick={handleViewDetails} className="flex gap-2 text-lg font-semibold mb-2 text-white hover:text-purple-300 line-clamp-1 cursor-pointer">
          {exercise.title || exercise.name || "Unnamed Exercise"}<SquareArrowOutUpRight size={14} />
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
      </div>
    </div>
  );
};

export default ExerciseCard; 