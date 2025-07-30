import React, { useState } from 'react';
import { Grid, Search } from 'lucide-react';

const ExerciseControls = ({ filteredExercises, layoutSize, setLayoutSize, handleSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  return (
    <div className="bg-primary-800 text-white p-4 rounded-lg mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h2 className="text-xl font-semibold">
          <span className="text-primary-400">{filteredExercises.length}</span> Exercises Found
        </h2>

        {/* Search Input */}
        <form onSubmit={onSubmit} className="w-full md:w-auto flex-grow md:max-w-md">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search exercises..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full py-2 px-4 pr-10 bg-primary-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-1 p-2 text-gray-400 hover:text-white"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Layout Size Controls */}
        <div className="flex space-x-1 bg-primary-700 rounded-md p-1">
          <button
            onClick={() => setLayoutSize('small')}
            className={`p-1 rounded ${layoutSize === 'small' ? 'bg-primary-500' : 'hover:bg-primary-600'}`}
            title="Small"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setLayoutSize('medium')}
            className={`p-1 rounded ${layoutSize === 'medium' ? 'bg-primary-500' : 'hover:bg-primary-600'}`}
            title="Medium"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setLayoutSize('large')}
            className={`p-1 rounded ${layoutSize === 'large' ? 'bg-primary-500' : 'hover:bg-primary-600'}`}
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