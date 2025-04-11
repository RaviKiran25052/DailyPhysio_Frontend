import React from 'react';
import { ChevronRight } from 'lucide-react';
import { categories, positions } from './ExerciseData';

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
    <aside className={`md:w-1/4 md:block ${showFilters ? 'block' : 'hidden'}`}>
      <div className="bg-gray-800 rounded-lg p-5 shadow-lg sticky top-4 md:min-h-[calc(100vh-8rem)]">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <span>{selectedCategory}</span>
          <ChevronRight size={16} />
          <span>{selectedPosition}</span>
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold bg-gray-700 p-3 rounded-t-lg border-l-4 border-purple-500">Category</h3>
          <ul className="bg-gray-900/50 p-2 rounded-b-lg max-h-[300px] overflow-y-auto">
            {categories.map(category => (
              <li key={category}>
                <button
                  className={`w-full text-left py-2 px-3 rounded ${selectedCategory === category ? 'bg-purple-700 text-white' : 'hover:bg-gray-700'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Positions */}
        <div>
          <h3 className="text-lg font-semibold bg-gray-700 p-3 rounded-t-lg border-l-4 border-purple-500">Position</h3>
          <div className="relative">
            <button 
              className="flex justify-between items-center w-full bg-gray-900/50 p-3 text-left hover:bg-gray-700/70"
              onClick={() => setShowPositionDropdown(!showPositionDropdown)}
            >
              <span>{selectedPosition}</span>
              <ChevronRight className={`transform transition-transform ${showPositionDropdown ? 'rotate-90' : ''}`} size={16} />
            </button>
            
            {showPositionDropdown && (
              <div className="absolute z-10 bg-gray-800 w-full mt-1 border border-gray-700 rounded shadow-lg">
                <div className="grid grid-cols-2 gap-1 p-2">
                  {positions.map(position => (
                    <button
                      key={position}
                      onClick={() => {
                        setSelectedPosition(position);
                        setShowPositionDropdown(false);
                      }}
                      className={`text-left p-2 rounded ${selectedPosition === position ? 'bg-purple-700' : 'hover:bg-gray-700'}`}
                    >
                      {position}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ExerciseSidebar; 