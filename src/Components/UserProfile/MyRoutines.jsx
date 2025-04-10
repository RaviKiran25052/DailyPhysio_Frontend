import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';

const MyRoutines = () => {
  const [activeTab, setActiveTab] = useState('private');
  
  // Mock data for routines
  const [privateRoutines, setPrivateRoutines] = useState([]);
  const [sharedRoutines, setSharedRoutines] = useState([
    { id: 1, name: "Lower Back Recovery", exercises: 5, lastModified: "2 days ago" },
    { id: 2, name: "Shoulder Rehabilitation", exercises: 8, lastModified: "1 week ago" }
  ]);
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Page Title */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold flex items-center">
          <FileText size={24} className="mr-3 text-purple-400" />
          My Routines
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'private' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('private')}
        >
          Private Routines
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center ${activeTab === 'shared' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('shared')}
        >
          Shared Routines
        </button>
      </div>

      {/* Routines List */}
      <div className="p-6">
        {activeTab === 'private' ? (
          privateRoutines.length > 0 ? (
            <div className="grid gap-4">
              {privateRoutines.map(routine => (
                <div key={routine.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition">
                  <h3 className="font-medium">{routine.name}</h3>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>{routine.exercises} exercises</span>
                    <span>Modified {routine.lastModified}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <FileText size={48} className="text-gray-600" />
              </div>
              <p className="text-gray-400 mb-6">No saved routines</p>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                Create New Routine
              </button>
            </div>
          )
        ) : (
          <div className="grid gap-4">
            {sharedRoutines.map(routine => (
              <div key={routine.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition">
                <h3 className="font-medium">{routine.name}</h3>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>{routine.exercises} exercises</span>
                  <span>Modified {routine.lastModified}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Create New Routine */}
      <div className="p-6 pt-0">
        <button 
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center space-x-2 transition"
        >
          <Plus size={20} />
          <span>Create New Routine</span>
        </button>
      </div>
    </div>
  );
};

export default MyRoutines; 