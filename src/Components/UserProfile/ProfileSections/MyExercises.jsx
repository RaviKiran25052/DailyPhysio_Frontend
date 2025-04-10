import React, { useState } from 'react';

const MyExercises = ({ userData }) => {
  const [activeExerciseTab, setActiveExerciseTab] = useState('public');
  
  // Mock data for exercises
  const [publicExercises, setPublicExercises] = useState([]);
  const [privateExercises, setPrivateExercises] = useState([
    { id: 1, name: "Knee Extension", target: "Quadriceps", lastModified: "3 days ago" },
    { id: 2, name: "Hamstring Curl", target: "Hamstrings", lastModified: "1 week ago" }
  ]);
  const [sharedExercises, setSharedExercises] = useState([
    { id: 3, name: "Lateral Raise", target: "Shoulders", lastModified: "5 days ago" }
  ]);
  
  return (
    <div className="bg-gray-900 shadow-lg overflow-hidden">
      {/* Page Title */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          My Exercises
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          className={`flex-1 py-3 px-4 text-center ${activeExerciseTab === 'public' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveExerciseTab('public')}
        >
          My Public Exercises
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center ${activeExerciseTab === 'private' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveExerciseTab('private')}
        >
          My Private Exercises
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center ${activeExerciseTab === 'shared' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveExerciseTab('shared')}
        >
          My Shared Exercises
        </button>
      </div>

      {/* Exercise List */}
      <div className="p-6">
        {activeExerciseTab === 'public' ? (
          publicExercises.length > 0 ? (
            <div className="grid gap-4">
              {publicExercises.map(exercise => (
                <div key={exercise.id} className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white">{exercise.name}</h3>
                    <p className="text-sm text-gray-400">Target: {exercise.target}</p>
                  </div>
                  <span className="text-xs text-gray-400">Modified {exercise.lastModified}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-purple-400 italic mb-6">You have no public exercises</p>
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
                Create Exercise
              </button>
            </div>
          )
        ) : activeExerciseTab === 'private' ? (
          privateExercises.length > 0 ? (
            <div className="grid gap-4">
              {privateExercises.map(exercise => (
                <div key={exercise.id} className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-white">{exercise.name}</h3>
                    <p className="text-sm text-gray-400">Target: {exercise.target}</p>
                  </div>
                  <span className="text-xs text-gray-400">Modified {exercise.lastModified}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-6">No private exercises</p>
              <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
                Create Private Exercise
              </button>
            </div>
          )
        ) : (
          <div className="grid gap-4">
            {sharedExercises.map(exercise => (
              <div key={exercise.id} className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-white">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">Target: {exercise.target}</p>
                </div>
                <span className="text-xs text-gray-400">Modified {exercise.lastModified}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyExercises; 