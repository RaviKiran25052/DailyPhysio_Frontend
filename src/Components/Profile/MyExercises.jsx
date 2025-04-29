import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dumbbell, Globe, Lock
} from 'lucide-react';
import ExerciseCard from './ExerciseCard';
import EmptyState from './EmptyState';
import TypeChangeModal from './TypeChangeModal';
import DeleteModal from './DeleteModal';

const API_URL = process.env.REACT_APP_API_URL;

// Loading State Component
const LoadingState = () => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-400">Loading exercises...</p>
    </div>
  );
};

// Error State Component
const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="text-center py-8">
      <p className="text-red-400">{message}</p>
      <button
        className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
};

// Main Component
const MyExercises = () => {
  const [activeExerciseTab, setActiveExerciseTab] = useState('public');
  const [publicExercises, setPublicExercises] = useState([]);
  const [privateExercises, setPrivateExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for confirm popups
  const [typeConfirmOpen, setTypeConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Dummy data for development
  const dummyExercises = [
    {
      _id: "1",
      title: "Knee Extension",
      description: "Exercise to strengthen quadriceps",
      instruction: "Sit on a chair, extend your knee fully, hold, then return to starting position",
      video: ["/videos/knee-extension.mp4"],
      image: ["/images/knee-extension.jpg", "/images/knee-extension-2.jpg"],
      category: "Hip and Knee",
      subCategory: "Strengthening",
      position: "Sitting",
      reps: 10,
      hold: 5,
      complete: 3,
      perform: { count: 2, type: "day" },
      views: 245,
      favorites: 12,
      custom: { createdBy: "proUser", type: "public" },
      createdAt: "2025-04-20T10:30:00Z"
    },
    {
      _id: "2",
      title: "Cervical Rotation",
      description: "Exercise to improve neck mobility",
      instruction: "Slowly turn your head to the right, hold, return to center, then turn to the left",
      video: [],
      image: ["/images/cervical-rotation.jpg"],
      category: "Cervical",
      subCategory: "Mobility",
      position: "Sitting",
      reps: 5,
      hold: 10,
      complete: 2,
      perform: { count: 1, type: "day" },
      views: 178,
      favorites: 8,
      custom: { createdBy: "proUser", type: "public" },
      createdAt: "2025-04-18T14:45:00Z"
    },
    {
      _id: "3",
      title: "Hamstring Stretch",
      description: "Exercise for hamstring flexibility",
      instruction: "Sit with one leg extended, reach forward toward your toes",
      video: ["/videos/hamstring-stretch.mp4"],
      image: [],
      category: "Hip and Knee",
      subCategory: "Flexibility",
      position: "Sitting",
      reps: 3,
      hold: 30,
      complete: 1,
      perform: { count: 3, type: "week" },
      views: 0,
      favorites: 0,
      custom: { createdBy: "proUser", type: "private" },
      createdAt: "2025-04-25T09:15:00Z"
    },
    {
      _id: "4",
      title: "Shoulder External Rotation",
      description: "Exercise to strengthen rotator cuff",
      instruction: "With elbow at your side, rotate your forearm outward against resistance",
      video: [],
      image: [],
      category: "Shoulder",
      subCategory: "Strengthening",
      position: "Standing",
      reps: 12,
      hold: 2,
      complete: 3,
      perform: { count: 1, type: "day" },
      views: 0,
      favorites: 0,
      custom: { createdBy: "proUser", type: "private" },
      createdAt: "2025-04-22T16:30:00Z"
    }
  ];

  useEffect(() => {
    // Fetch exercises function
    const fetchExercises = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would make an API call like:
        // const response = await axios.get(`${API_URL}/exercises/my-exercises`, {
        //   headers: { Authorization: `Bearer ${userData.token}` }
        // });
        // const data = response.data;

        // For now, use dummy data
        const data = dummyExercises;

        // Filter exercises by type
        const publicData = data.filter(exercise => exercise.custom.type === "public");
        const privateData = data.filter(exercise => exercise.custom.type === "private");

        setPublicExercises(publicData);
        setPrivateExercises(privateData);
      } catch (err) {
        setError("Failed to fetch exercises");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Create exercise handler
  const handleCreateExercise = (type) => {
    // In a real implementation, redirect to exercise creation page
    // or open a modal with the type pre-selected
    console.log(`Creating ${type} exercise`);
  };

  // Open type change confirmation popup
  const openTypeConfirm = (exercise) => {
    setSelectedExercise(exercise);
    setTypeConfirmOpen(true);
  };

  // Open delete confirmation popup
  const openDeleteConfirm = (exercise) => {
    setSelectedExercise(exercise);
    setDeleteConfirmOpen(true);
  };

  // Handle type change
  const handleTypeChange = async () => {
    if (!selectedExercise) return;

    const newType = selectedExercise.custom.type === 'public' ? 'private' : 'public';

    try {
      // In a real implementation, you would make an API call:
      // await axios.patch(`${API_URL}/exercises/${selectedExercise._id}`, 
      //   { "custom.type": newType },
      //   { headers: { Authorization: `Bearer ${userData.token}` } }
      // );

      // For now, update local state only
      const updatedExercise = {
        ...selectedExercise,
        custom: { ...selectedExercise.custom, type: newType }
      };

      if (newType === 'public') {
        setPrivateExercises(prev => prev.filter(ex => ex._id !== selectedExercise._id));
        setPublicExercises(prev => [...prev, updatedExercise]);
      } else {
        setPublicExercises(prev => prev.filter(ex => ex._id !== selectedExercise._id));
        setPrivateExercises(prev => [...prev, updatedExercise]);
      }

      // Success message would go here
      console.log(`Exercise ${selectedExercise._id} changed to ${newType}`);
    } catch (err) {
      console.error("Failed to update exercise type:", err);
      // Error message would go here
    } finally {
      setTypeConfirmOpen(false);
      setSelectedExercise(null);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedExercise) return;

    try {
      // In a real implementation, you would make an API call:
      // await axios.delete(`${API_URL}/exercises/${selectedExercise._id}`, {
      //   headers: { Authorization: `Bearer ${userData.token}` }
      // });

      // For now, update local state only
      if (selectedExercise.custom.type === 'public') {
        setPublicExercises(prev => prev.filter(ex => ex._id !== selectedExercise._id));
      } else {
        setPrivateExercises(prev => prev.filter(ex => ex._id !== selectedExercise._id));
      }

      // Success message would go here
      console.log(`Exercise ${selectedExercise._id} deleted`);
    } catch (err) {
      console.error("Failed to delete exercise:", err);
      // Error message would go here
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedExercise(null);
    }
  };

  return (
    <div className="bg-gray-900 shadow-lg overflow-hidden rounded-lg">
      {/* Page Title */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white flex items-center">
          <Dumbbell size={20} className="mr-2 text-purple-400" />
          My Exercises
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          className={`flex-1 py-3 px-4 text-center flex items-center justify-center ${activeExerciseTab === 'public' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveExerciseTab('public')}
        >
          <Globe size={16} className="mr-2" />
          My Public Exercises
        </button>
        <button
          className={`flex-1 py-3 px-4 text-center flex items-center justify-center ${activeExerciseTab === 'private' ? 'text-purple-400 border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveExerciseTab('private')}
        >
          <Lock size={16} className="mr-2" />
          My Private Exercises
        </button>
      </div>

      {/* Exercise List */}
      <div className="p-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : activeExerciseTab === 'public' ? (
          publicExercises.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {publicExercises.map(exercise => (
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  onTypeChange={openTypeConfirm}
                  onDelete={openDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="public" onCreate={handleCreateExercise} />
          )
        ) : (
          privateExercises.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {privateExercises.map(exercise => (
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  onTypeChange={openTypeConfirm}
                  onDelete={openDeleteConfirm}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="private" onCreate={handleCreateExercise} />
          )
        )}
      </div>

      {/* Modals */}
      <TypeChangeModal
        state={typeConfirmOpen}
        exercise={selectedExercise}
        onConfirm={handleTypeChange}
        onCancel={() => setTypeConfirmOpen(false)}
      />

      <DeleteModal
        state={deleteConfirmOpen}
        exercise={selectedExercise}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default MyExercises;