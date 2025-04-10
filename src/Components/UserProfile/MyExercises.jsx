import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';

const MyExercises = () => {
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
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Page Title */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold flex items-center">
          <Dumbbell size={24} className="mr-3 text-purple-400" />
          My Exercises
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
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
                <div key={exercise.id} className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition flex justify-between items-center">
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
              <div className="flex justify-center mb-4">
                <Dumbbell size={48} className="text-gray-600" />
              </div>
              <p className="text-red-500 italic mb-6">You have no public exercises</p>
            </div>
          )
        ) : activeExerciseTab === 'private' ? (
          privateExercises.length > 0 ? (
            <div className="grid gap-4">
              {privateExercises.map(exercise => (
                <div key={exercise.id} className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition flex justify-between items-center">
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
              <div className="flex justify-center mb-4">
                <Dumbbell size={48} className="text-gray-600" />
              </div>
              <p className="text-gray-400 mb-6">No private exercises</p>
            </div>
          )
        ) : (
          <div className="grid gap-4">
            {sharedExercises.map(exercise => (
              <div key={exercise.id} className="bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition flex justify-between items-center">
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