import React from 'react';
import { Settings, Plus, Check, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useExerciseContext } from '../../context/ExerciseContext';

const ExerciseFooter = () => {
  const { 
    selectedExercises, 
    removeExercise, 
    clearExercises,
    activeTab,
    setActiveTab
  } = useExerciseContext();

  // If no exercises are selected, show the empty state
  if (selectedExercises.length === 0) {
    return (
      <footer className="bg-gray-900 border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="bg-black rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <button className="font-semibold text-gray-400 hover:text-white">Exercise Plan</button>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                  <Settings size={20} />
                </button>
              </div>
            </div>
            
            <div className="text-center text-gray-400 py-8">
              <p>Your exercise plan is empty. Add items by clicking add <Plus className="inline-block mx-1" size={18} /> buttons</p>
              <p className="mt-2">OR load a saved routine with the options <Settings className="inline-block mx-1" size={18} /> button.</p>
              <p className="mt-2">When done, click the Done <Check className="inline-block mx-1" size={18} /> button.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Get the currently active exercise
  const currentExercise = selectedExercises[activeTab] || selectedExercises[0];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="bg-black rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1 overflow-x-auto pb-1 max-w-[70%]">
              {selectedExercises.map((exercise, index) => (
                <button 
                  key={exercise.id}
                  className={`font-semibold whitespace-nowrap px-3 py-1 rounded-md ${
                    index === activeTab 
                      ? 'text-white bg-purple-600' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {exercise.name}
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <button 
                className="p-2 bg-gray-800 rounded hover:bg-gray-700 text-red-400"
                onClick={clearExercises}
                title="Clear all exercises"
              >
                <X size={20} />
              </button>
              <button className="p-2 bg-gray-800 rounded hover:bg-gray-700 text-gray-300">
                <Settings size={20} />
              </button>
              <button className="p-2 bg-purple-600 rounded hover:bg-purple-700 text-white">
                <Check size={20} />
              </button>
            </div>
          </div>
          
          {/* Exercise details */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Exercise image */}
            <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-gray-800">
              <img 
                src={currentExercise.image || "https://via.placeholder.com/800x600?text=Exercise+Image"} 
                alt={currentExercise.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Exercise info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{currentExercise.name}</h3>
              <div className="mb-2 flex flex-wrap gap-1">
                {currentExercise.categories?.map((category, index) => (
                  <span key={index} className="text-xs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full">
                    {category}
                  </span>
                ))}
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                  {currentExercise.position || "Any Position"}
                </span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                {currentExercise.description || "No description available."}
              </p>
              
              {/* Parameters */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div className="bg-gray-800 rounded p-2 text-center">
                  <span className="text-xs text-gray-400 block">Reps</span>
                  <span className="text-sm">3 Times</span>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <span className="text-xs text-gray-400 block">Hold</span>
                  <span className="text-sm">5 Seconds</span>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <span className="text-xs text-gray-400 block">Sets</span>
                  <span className="text-sm">3 Sets</span>
                </div>
                <div className="bg-gray-800 rounded p-2 text-center">
                  <span className="text-xs text-gray-400 block">Frequency</span>
                  <span className="text-sm">Daily</span>
                </div>
              </div>
            </div>
            
            {/* Navigation and delete */}
            <div className="flex flex-row sm:flex-col justify-between sm:justify-center space-y-0 sm:space-y-2 space-x-2 sm:space-x-0">
              <button 
                className={`p-2 rounded-full bg-gray-800 hover:bg-gray-700 ${activeTab === 0 ? 'text-gray-600' : 'text-gray-400'}`}
                disabled={activeTab === 0}
                onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-red-400"
                onClick={() => {
                  removeExercise(currentExercise.id);
                  setActiveTab(Math.min(activeTab, selectedExercises.length - 2));
                }}
                title="Remove exercise"
              >
                <X size={20} />
              </button>
              <button 
                className={`p-2 rounded-full bg-gray-800 hover:bg-gray-700 ${activeTab === selectedExercises.length - 1 ? 'text-gray-600' : 'text-gray-400'}`}
                disabled={activeTab === selectedExercises.length - 1}
                onClick={() => setActiveTab(Math.min(selectedExercises.length - 1, activeTab + 1))}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ExerciseFooter; 