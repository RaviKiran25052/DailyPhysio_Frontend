import React from 'react';
import { Plus } from 'lucide-react';

const MyRoutines = ({ user }) => {
  // Mock data for routines based on corrected schema understanding
  const routines = [
    {
      id: 1,
      exerciseId: "ex123",
      name: "Lumbar Extension",
      reps: 10,
      hold: 5,
      complete: 2,
      perform: {
        count: 3,
        type: 'day'
      },
      exercise: {
        title: "Lumbar Extension",
        description: "Extension exercise for the lumbar spine",
        instruction: "Lie face down and lift upper body slowly",
        category: "Lumbar Thoracic",
        subCategory: "Flexion/Extension",
        position: "Prone"
      },
      updatedAt: "2 days ago"
    },
    {
      id: 2,
      exerciseId: "ex124",
      name: "Pelvic Tilt",
      reps: 15,
      hold: 3,
      complete: 3,
      perform: {
        count: 2,
        type: 'day'
      },
      exercise: {
        title: "Pelvic Tilt",
        description: "Core stabilizing exercise",
        instruction: "Lie on back and tilt pelvis to flatten lower back",
        category: "Lumbar Thoracic",
        subCategory: "Stabilization",
        position: "Supine"
      },
      updatedAt: "3 days ago"
    },
    {
      id: 3,
      exerciseId: "ex125",
      name: "External Rotation",
      reps: 12,
      hold: 2,
      complete: 3,
      perform: {
        count: 2,
        type: 'day'
      },
      exercise: {
        title: "External Rotation",
        description: "Strengthens external rotators of the shoulder",
        instruction: "Stand with elbow at side, rotate forearm outward",
        category: "Shoulder",
        subCategory: "Rotation",
        position: "Standing"
      },
      updatedAt: "1 week ago"
    },
    {
      id: 4,
      exerciseId: "ex126",
      name: "Ankle Dorsiflexion",
      reps: 15,
      hold: 3,
      complete: 2,
      perform: {
        count: 3,
        type: 'day'
      },
      exercise: {
        title: "Ankle Dorsiflexion",
        description: "Increases ankle mobility",
        instruction: "Pull foot toward shin",
        category: "Ankle and Foot",
        subCategory: "Mobility",
        position: "Sitting"
      },
      updatedAt: "5 days ago"
    }
  ];

  return (
    <div className="bg-gray-800 shadow-lg overflow-hidden">
      {/* Page Title */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          My Routines
        </h1>
        <button
          className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center space-x-2 transition"
        >
          <Plus size={20} />
          <span>Create New Routine</span>
        </button>
      </div>

      {/* Routines List */}
      <div className="p-6">
        {routines.length > 0 ? (
          <div className="grid gap-4">
            {routines.map(routine => (
              <div key={routine.id} className="bg-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-lg">{routine.name}</h3>
                    <button className="p-2 text-sm bg-purple-600 hover:bg-purple-700 rounded text-white">
                      View routine
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 mb-2">
                    {routine.exercise.category} • {routine.exercise.position}
                  </p>

                  <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                    <div className="bg-purple-950 p-2 rounded flex flex-col items-center">
                      <span className="text-gray-400">Reps</span>
                      <span className="font-medium">{routine.reps}</span>
                    </div>
                    <div className="bg-purple-950 p-2 rounded flex flex-col items-center">
                      <span className="text-gray-400">Hold</span>
                      <span className="font-medium">{routine.hold}s</span>
                    </div>
                    <div className="bg-purple-950 p-2 rounded flex flex-col items-center">
                      <span className="text-gray-400">Complete</span>
                      <span className="font-medium">{routine.complete}</span>
                    </div>
                    <div className="bg-purple-950 p-2 rounded flex flex-col items-center">
                      <span className="text-gray-400">Perform</span>
                      <span className="font-medium">{routine.perform.count}/{routine.perform.type}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Last modified: {routine.updatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-purple-500 italic mb-6">You have no routines</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRoutines;