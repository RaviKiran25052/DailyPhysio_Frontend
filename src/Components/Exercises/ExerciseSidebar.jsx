import React from 'react';
import { ChevronRight, Filter } from 'lucide-react';

const positions = ["All", "Kneeling", "Prone", "Quadruped", "Side Lying", "Sitting", "Standing", "Supine"];

const categories = [
  'Ankle and Foot',
  'Cervical',
  'Education',
  'Elbow and Hand',
  'Hip and Knee',
  'Lumbar Thoracic',
  'Oral Motor',
  'Shoulder',
  'Special'
];

const ExerciseSidebar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedPosition, 
  setSelectedPosition, 
  showFilters,
  showPositionDropdown,
  setShowPositionDropdown 
}) => {
  return (
    <aside className={`w-full ${showFilters ? 'block' : 'hidden'} md:block`}>
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg sticky top-20 overflow-hidden">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Filter size={18} className="mr-2 text-purple-400" />
            Filters
          </h2>
          <div className="bg-purple-600 text-xs font-medium px-2 py-1 rounded-full text-white">
            {categories.length} Categories
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="flex flex-wrap items-center gap-2 mb-4 px-2 py-3 bg-gray-700/50 rounded-lg">
          <span className="text-xs font-medium text-gray-400">Selected:</span>
          <div className="flex-1 flex items-center">
            <span className="text-sm font-medium text-purple-300">{selectedCategory}</span>
            <ChevronRight size={14} className="mx-1 text-gray-500" />
            <span className="text-sm font-medium text-gray-200">{selectedPosition}</span>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-5">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1">Category</h3>
          <div className="bg-gray-700/30 rounded-lg p-1.5">
            <ul className="max-h-[250px] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
              {categories.map(category => (
                <li key={category}>
                  <button
                    className={`w-full text-left py-2 px-3 rounded-md text-sm transition-colors ${
                      selectedCategory === category 
                        ? 'bg-purple-600 text-white font-medium' 
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Positions */}
        <div>
          <h3 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-2 px-1">Position</h3>
          <div className="bg-gray-700/30 rounded-lg p-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              {positions.map(position => (
                <button
                  key={position}
                  onClick={() => setSelectedPosition(position)}
                  className={`text-left py-2 px-3 rounded-md text-sm transition-colors ${
                    selectedPosition === position 
                      ? 'bg-purple-600 text-white font-medium' 
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(124, 58, 237, 0.5) rgba(31, 41, 55, 0.5);
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(124, 58, 237, 0.5);
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
};

export default ExerciseSidebar; 