import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { exerciseData } from '../Components/ExercisesPage/ExerciseData';
import { ArrowLeft, ChevronRight, Heart, PlayCircle, Clock, Activity, ArrowRight, Save, Plus, Check } from 'lucide-react';
import { useExerciseContext } from '../context/ExerciseContext';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addExercise } = useExerciseContext();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedExercises, setRelatedExercises] = useState([]);
  const [reps, setReps] = useState('1 Time');
  const [hold, setHold] = useState('1 Second');
  const [sets, setSets] = useState('1 Set');
  const [frequency, setFrequency] = useState('a Day');
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToHep, setAddedToHep] = useState(false);

  useEffect(() => {
    // Find the exercise by ID
    const exerciseId = parseInt(id);
    const foundExercise = exerciseData.find(ex => ex.id === exerciseId);
    
    if (foundExercise) {
      setExercise(foundExercise);
      
      // Find related exercises in the same category
      const related = exerciseData
        .filter(ex => 
          ex.id !== exerciseId && 
          ex.categories.some(cat => 
            foundExercise.categories.includes(cat)
          )
        )
        .slice(0, 3); // Get up to 3 related exercises
      
      setRelatedExercises(related);
    } else {
      // If exercise not found, prepare to redirect
      console.error('Exercise not found');
    }
    
    setLoading(false);
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleAddToHep = () => {
    if (exercise) {
      // Add the exercise to the context
      addExercise(exercise);
      setAddedToHep(true);
      
      // Show temporary success message
      setTimeout(() => {
        setAddedToHep(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Exercise Not Found</h1>
        <p className="text-gray-400 mb-6">The exercise you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/exercises')}
          className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition"
        >
          View All Exercises
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      {/* Header with back button */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1 sm:mr-2" />
          </button>
          <h1 className="text-lg font-bold ml-auto">
            <span className="text-purple-500">Exercise</span>
            <span className="text-white">MD</span>
          </h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Image and details */}
          <div className="w-full lg:w-2/3">
            {/* Exercise title and category */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {exercise.categories.map((category, index) => (
                  <span key={index} className="text-xs bg-purple-900/60 text-purple-300 px-2 py-1 rounded-full">
                    {category}
                  </span>
                ))}
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                  {exercise.position}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{exercise.name.toUpperCase()}</h1>
            </div>

            {/* Exercise image */}
            <div className="relative rounded-xl overflow-hidden mb-6 border border-gray-800">
              <div className="aspect-[4/3] w-full">
                <img 
                  src={exercise.image || "https://via.placeholder.com/800x600?text=Exercise+Image"} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-20"></div>
              
              {/* Favorite button */}
              <button 
                onClick={toggleFavorite}
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-800/80 hover:bg-purple-900/80 transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart size={20} className={isFavorite ? "text-purple-500 fill-purple-500" : "text-gray-300"} />
              </button>
              
              {/* Video button */}
              <button 
                className="absolute bottom-3 right-3 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg px-3 py-2 text-sm"
                aria-label="View video"
              >
                <PlayCircle size={16} />
                <span className="hidden sm:inline">View Video</span>
              </button>
            </div>
            
            {/* Exercise instructions */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-5 mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Instructions</h2>
              <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">
                {exercise.description || `Lying on your back with your knees bent, gently rotate your spine as you move your knees to the side and then reverse directions and move your knees to the other side. Repeat as you move through a comfortable range of motion.`}
              </p>
            </div>
            
            {/* Exercise parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <label htmlFor="reps" className="block text-xs sm:text-sm text-gray-400 mb-1">Reps</label>
                <select 
                  id="reps" 
                  className="w-full bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-sm"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                >
                  <option>1 Time</option>
                  <option>2 Times</option>
                  <option>3 Times</option>
                  <option>4 Times</option>
                  <option>5 Times</option>
                  <option>10 Times</option>
                  <option>15 Times</option>
                  <option>20 Times</option>
                </select>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <label htmlFor="hold" className="block text-xs sm:text-sm text-gray-400 mb-1">Hold</label>
                <select 
                  id="hold" 
                  className="w-full bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-sm"
                  value={hold}
                  onChange={(e) => setHold(e.target.value)}
                >
                  <option>1 Second</option>
                  <option>2 Seconds</option>
                  <option>3 Seconds</option>
                  <option>5 Seconds</option>
                  <option>10 Seconds</option>
                  <option>15 Seconds</option>
                  <option>20 Seconds</option>
                  <option>30 Seconds</option>
                </select>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <label htmlFor="sets" className="block text-xs sm:text-sm text-gray-400 mb-1">Complete</label>
                <select 
                  id="sets" 
                  className="w-full bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-sm"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                >
                  <option>1 Set</option>
                  <option>2 Sets</option>
                  <option>3 Sets</option>
                  <option>4 Sets</option>
                  <option>5 Sets</option>
                </select>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <label htmlFor="frequency" className="block text-xs sm:text-sm text-gray-400 mb-1">Perform</label>
                <div className="flex items-center gap-1 sm:gap-2">
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    defaultValue="1" 
                    className="w-10 sm:w-12 bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-center text-sm"
                    aria-label="Frequency count"
                  />
                  <select 
                    id="frequency" 
                    className="flex-1 bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-sm"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option>a Day</option>
                    <option>a Week</option>
                    <option>Every Other Day</option>
                    <option>as Needed</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-2 sm:p-3 text-sm"
              >
                <ArrowLeft size={16} className="text-purple-400" />
                <span className="text-white hidden xs:inline">Back</span>
              </button>
              
              <button className="flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-2 sm:p-3 text-sm">
                <Save size={16} className="text-purple-400" />
                <span className="text-white hidden xs:inline">Save</span>
              </button>
              
              <button 
                onClick={handleAddToHep}
                className={`flex items-center justify-center gap-1 ${addedToHep ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} transition-colors rounded-lg p-2 sm:p-3 text-sm`}
              >
                {addedToHep ? (
                  <>
                    <Check size={16} className="text-white" />
                    <span className="text-white hidden xs:inline">Added</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} className="text-white" />
                    <span className="text-white hidden xs:inline">Add To HEP</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Right column - Related exercises */}
          <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-5 lg:sticky lg:top-20">
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex justify-between items-center">
                <span>Similar Exercises</span>
                <Activity size={20} className="text-purple-400" />
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {relatedExercises.length > 0 ? (
                  relatedExercises.map(relatedEx => (
                    <Link 
                      key={relatedEx.id} 
                      to={`/exercise/${relatedEx.id}`}
                      className="flex items-center p-2 sm:p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        <img 
                          src={relatedEx.image} 
                          alt={relatedEx.name} 
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 mx-2 sm:mx-3">
                        <h3 className="font-medium text-white text-xs sm:text-sm">{relatedEx.name}</h3>
                        <p className="text-xs text-gray-400 truncate">{relatedEx.categories.join(', ')}</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No related exercises found.</p>
                )}
              </div>
              
              <div className="mt-5 sm:mt-6">
                <Link 
                  to="/exercises" 
                  className="w-full flex items-center justify-center gap-2 py-2 border border-purple-500 text-purple-400 hover:bg-purple-600/20 transition-colors rounded-lg text-sm"
                >
                  View All Exercises
                  <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-700">
                <h3 className="text-base sm:text-lg font-medium mb-3">Exercise Details</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-purple-300">{exercise.categories.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Position:</span>
                    <span className="text-white">{exercise.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Group:</span>
                    <span className="text-white">{exercise.group}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Created:</span>
                    <span className="text-gray-300">Jan 10th, 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage; 