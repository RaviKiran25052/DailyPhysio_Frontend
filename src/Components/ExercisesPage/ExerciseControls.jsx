import React from 'react';
import { Grid } from 'lucide-react';

const ExerciseControls = ({ filteredExercises, layoutSize, setLayoutSize }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6 flex flex-wrap justify-between items-center">
      <h2 className="text-xl font-semibold">
        <span className="text-purple-400">{filteredExercises.length}</span> Exercises Found
      </h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <span>Sort By:</span>
          <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option>Most Recent</option>
            <option>Alphabetical</option>
            <option>Category</option>
          </select>
        </div>
        
        {/* Layout Size Controls */}
        <div className="flex space-x-1 bg-gray-700 rounded-md p-1">
          <button 
            onClick={() => setLayoutSize('small')}
            className={`p-1 rounded ${layoutSize === 'small' ? 'bg-purple-700' : 'hover:bg-gray-600'}`}
            title="Small"
          >
            <Grid size={16} />
          </button>
          <button 
            onClick={() => setLayoutSize('medium')}
            className={`p-1 rounded ${layoutSize === 'medium' ? 'bg-purple-700' : 'hover:bg-gray-600'}`}
            title="Medium"
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setLayoutSize('large')}
            className={`p-1 rounded ${layoutSize === 'large' ? 'bg-purple-700' : 'hover:bg-gray-600'}`}
            title="Large"
          >
            <Grid size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseControls; 