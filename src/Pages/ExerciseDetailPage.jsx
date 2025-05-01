import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Heart, PlayCircle, Activity, ArrowRight, Save, Plus, Check, UserPlus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MediaCarousel from '../Components/Profile/MediaCarousel';
const API_URL = process.env.REACT_APP_API_URL;

const ExerciseDetailPage = ({ userData }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    reps: 1,
    hold: 1,
    complete: 1,
    perform: {
      count: 1,
      type: 'day'
    }
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToHep, setAddedToHep] = useState(false);
  const [exercise, setExercise] = useState([]);
  const [relatedExercises, setRelatedExercises] = useState([]);
  const [creatorData, setCreatorData] = useState({});
  const [isPro, setIsPro] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercise = async () => {
      const response = await axios.get(`${API_URL}/exercises/${id}`);
      console.log("data", response.data);
      const data = response.data;
      setIsPro(response.data.membership !== "free");
console.log(data.creatorData);

      setExercise(data.exercise);
      setCreatorData(data.creatorData);
      setRelatedExercises(data.relatedExercises);
    };
    fetchExercise();

    setLoading(false);
  }, []);


  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToHep = () => {
    if (exercise) {
      // Get current HEP exercises from localStorage
      const currentHep = JSON.parse(localStorage.getItem('hepExercises') || '[]');

      // Check if exercise is already in HEP
      const exerciseExists = currentHep.some(ex => ex._id === exercise._id);

      if (!exerciseExists) {
        // Add the exercise to localStorage
        const updatedHep = [...currentHep, exercise];
        localStorage.setItem('hepExercises', JSON.stringify(updatedHep));

        // Show success message
        toast.success('Added to HEP');
      } else {
        // Show info message if already in HEP
        toast.info('Exercise already in your HEP');
      }

      setAddedToHep(true);

      // Show temporary visual confirmation
      setTimeout(() => {
        setAddedToHep(false);
      }, 2000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'performCount') {
      setFormData({
        ...formData,
        perform: {
          ...formData.perform,
          count: parseInt(value)
        }
      });
    } else if (name === 'performType') {
      setFormData({
        ...formData,
        perform: {
          ...formData.perform,
          type: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
    }
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get exercise ID from current context or state
    const exerciseId = exercise._id; // Assuming exerciseData is available in your component

    // Prepare the payload with exercise ID and form data
    const payload = {
      exerciseId,
      reps: formData.reps,
      hold: formData.hold,
      complete: formData.complete,
      perform: formData.perform
    };

    const userToken = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_URL}/saved-exercises`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      });
      // Show success message
      if (response.status === 201) {
        toast.success('Exercise saved successfully');
      }


    } catch (error) {
      // Handle different error scenarios based on error response
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data.message || 'Something went wrong';

        // Handle specific error cases
        if (status === 403) {
          if (errorMessage.includes('premium exercise')) {
            toast.error('This is a premium exercise. Please upgrade to save it.');
          } else if (errorMessage.includes('up to 3 exercises')) {
            toast.warning('Free users can only save up to 3 exercises. Upgrade to pro for unlimited saves.');
          } else if (errorMessage.includes('subscription has expired')) {
            toast.error('Your subscription has expired. Please renew to continue saving exercises.');
          } else {
            toast.error(errorMessage);
          }
        } else if (status === 400 && errorMessage.includes('already saved')) {
          toast.info('You have already saved this exercise');
        } else {
          toast.error(errorMessage);
        }
      } else if (error.request) {
        // Network error
        toast.error('Network error. Please check your connection and try again.');
      } else {
        // Unexpected error
        toast.error('An unexpected error occurred. Please try again.');
      }

      console.error('Error saving exercise:', error);
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
    <div className="min-h-screen px-2 md:px-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1 sm:mr-2" />
            <span>Back</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Image and details */}
          <div className="w-full lg:w-2/3">
            {/* Exercise title and category */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-1 rounded-full">
                  {exercise?.category}
                </span>
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                  {exercise?.position}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{exercise?.title}</h1>
            </div>

            {/* Exercise image */}
            <div className="relative rounded-xl overflow-hidden mb-6 border border-gray-800">
              <div className="aspect-[4/2] w-full">
                <MediaCarousel images={exercise.image} videos={isPro ? exercise.video : []} />
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
              {isPro && (
                <button
                  className="absolute bottom-3 right-3 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg px-3 py-2 text-sm"
                  aria-label="View video"
                >
                  <PlayCircle size={16} />
                  <span className="hidden sm:inline">View Video</span>
                </button>
              )}
            </div>

            <div className="mb-6 bg-gray-800 rounded-xl p-4">
              <h3 className="text-base sm:text-lg font-medium mb-3">Exercise Details</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-purple-300">{exercise?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sub Category:</span>
                  <span className="text-white">{exercise?.subCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-white">{exercise?.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-300">{exercise?.createdAt?.split('T')[0]}</span>
                </div>
              </div>
            </div>

            {/* Exercise instructions */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-5 mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Instructions</h2>
              <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">
                {exercise?.description || `Lying on your back with your knees bent, gently rotate your spine as you move your knees to the side and then reverse directions and move your knees to the other side. Repeat as you move through a comfortable range of motion.`}
              </p>
            </div>

            {/* Exercise parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <label htmlFor="reps" className="block text-xs sm:text-sm text-gray-400 mb-1">Reps</label>
                <select
                  id="reps"
                  name="reps"
                  className="w-full bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-sm"
                  value={formData.reps}
                  onChange={handleChange}
                >
                  <option value={1}>1 Time</option>
                  <option value={2}>2 Times</option>
                  <option value={3}>3 Times</option>
                  <option value={4}>4 Times</option>
                  <option value={5}>5 Times</option>
                  <option value={10}>10 Times</option>
                  <option value={15}>15 Times</option>
                  <option value={20}>20 Times</option>
                </select>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <label htmlFor="hold" className="block text-xs sm:text-sm text-gray-400 mb-1">Hold</label>
                <select
                  id="hold"
                  name="hold"
                  className="w-full bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-sm"
                  value={formData.hold}
                  onChange={handleChange}
                >
                  <option value={1}>1 Second</option>
                  <option value={2}>2 Seconds</option>
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds</option>
                  <option value={10}>10 Seconds</option>
                  <option value={15}>15 Seconds</option>
                  <option value={20}>20 Seconds</option>
                  <option value={30}>30 Seconds</option>
                </select>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <label htmlFor="complete" className="block text-xs sm:text-sm text-gray-400 mb-1">Complete</label>
                <select
                  id="complete"
                  name="complete"
                  className="w-full bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-sm"
                  value={formData.complete}
                  onChange={handleChange}
                >
                  <option value={1}>1 Set</option>
                  <option value={2}>2 Sets</option>
                  <option value={3}>3 Sets</option>
                  <option value={4}>4 Sets</option>
                  <option value={5}>5 Sets</option>
                </select>
              </div>

              <div className="bg-gray-800 rounded-lg p-3 sm:p-4">
                <label htmlFor="performType" className="block text-xs sm:text-sm text-gray-400 mb-1">Perform</label>
                <div className="flex items-center gap-1 sm:gap-2">
                  <input
                    type="number"
                    name="performCount"
                    min="1"
                    max="10"
                    value={formData.perform.count}
                    onChange={handleChange}
                    className="w-10 sm:w-12 bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-center text-sm"
                    aria-label="Frequency count"
                  />
                  <select
                    id="performType"
                    name="performType"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded text-white p-1 sm:p-2 text-sm"
                    value={formData.perform.type}
                    onChange={handleChange}
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
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

              <button onClick={handleSubmit} className="flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-2 sm:p-3 text-sm">
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
            <div className=' flex flex-col gap-4 lg:sticky lg:top-20'>
              <div className="bg-gray-800 rounded-xl p-4 sm:p-5">
                <h2 className="text-lg sm:text-xl font-bold mb-4 flex justify-between items-center">
                  <span>Similar Exercises</span>
                  <Activity size={20} className="text-purple-400" />
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {relatedExercises?.length > 0 ? (
                    relatedExercises.map(relatedEx => (
                      <Link
                        key={relatedEx._id}
                        to={`/exercise/${relatedEx._id}`}
                        className="flex items-center p-2 sm:p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                          <img
                            src={relatedEx.image}
                            alt={relatedEx.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 mx-2 sm:mx-3">
                          <h3 className="font-medium text-white text-xs sm:text-sm">{relatedEx.title}</h3>
                          <p className="text-xs text-gray-400 truncate">{relatedEx.category}</p>
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
              </div>
              <div className='w-full h-[2px] rounded-md bg-gray-500/50' />
              <div className='bg-gray-800 rounded-xl p-4 flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-purple-500'>Created By:</h2>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-3'>
                      <img src="https://cdn-icons-png.flaticon.com/512/10813/10813372.png" width={30} alt="" />
                      <div>
                        <h3 className='text-sm font-medium text-white'>{exercise.custom?.createdBy === "therapist" && "Dr."} {creatorData.name}</h3>
                        <p className='text-xs text-gray-400'>{creatorData.specializations?.length ? creatorData.specializations.join(" | ") : "Pro User"}</p>
                      </div>
                    </div>
                    {exercise.custom?.createdBy === "therapist" && userData.membership?.type !== "free" &&
                      <button className='flex items-center border-2 border-purple-700 hover:bg-purple-800 hover:text-white text-sm rounded-md px-3 py-1'>
                        <UserPlus className='mr-2' size={16} />Follow
                      </button>
                    }
                  </div>
                </div>
                {userData.membership?.type !== "free" &&
                  <button className='border-2 border-purple-700 bg-purple-800 hover:bg-purple-900 hover:text-white text-sm rounded-md px-3 py-1'>View Exercises</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage; 