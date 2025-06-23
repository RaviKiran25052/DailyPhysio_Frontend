import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Heart, Activity, Save, UserPlus, X, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MediaCarousel from '../Components/MediaCarousel';
const API_URL = process.env.REACT_APP_API_URL || '';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [exercise, setExercise] = useState([]);
  const [relatedExercises, setRelatedExercises] = useState([]);
  const [creatorData, setCreatorData] = useState({});
  const [isPro, setIsPro] = useState(false);

  // Routine popup state
  const [showRoutinePopup, setShowRoutinePopup] = useState(false);

  // Check if we have routine data from location state
  const consultedData = location.state?.consultedData;
  const routineData = location.state?.routineData;

  // Form data - initialize with routine data if available
  const [formData, setFormData] = useState({
    reps: routineData?.reps || 1,
    hold: routineData?.hold || 1,
    complete: routineData?.complete || 1,
    perform: {
      count: routineData?.perform?.count || 1,
      type: routineData?.perform?.type || 'day'
    },
    name: exercise?.title || 'Exercise Routine'
  });

  // Check favorite status
  const checkFavoriteStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`${API_URL}/users/favorites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const favorites = response.data;

      setIsFavorite(favorites.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  useEffect(() => {
    const fetchExercise = async () => {
      try {

        const response = await axios.get(`${API_URL}/exercises/${id}`, {
          params: {
            consultedData
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = response.data;
        setIsPro(response.data.membership !== "free");
        setExercise(data.exercise);
        setCreatorData(data.creatorData);
        setRelatedExercises(data.relatedExercises);

        // Check favorite status
        await checkFavoriteStatus();
      } catch (error) {
        console.error('Error fetching exercise:', error);
        toast.error('Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);


  const toggleFavorite = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning('Please login to add this exercise to favorites');
      return;
    }
    setIsLoadingFavorite(true);

    try {
      if (!isFavorite) {
        await axios.post(
          `${API_URL}/users/favorites/`, {
          exerciseId: id
        },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success('Added to favorites');
      } else {
        await axios.delete(
          `${API_URL}/users/favorites/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success('Removed from favorites');
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info('Already in your favorites');
      } else {
        console.error('Error adding to favorites:', error);
        toast.error('Failed to add to favorites');
      }
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const toggleFollow = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning('Please login to follow this creator');
      return;
    }

    if (!creatorData || !creatorData.id) {
      toast.error('Creator information not available');
      return;
    }

    setIsLoadingFollow(true);

    try {
      if (creatorData.isFollowing) {
        await axios.delete(
          `${API_URL}/users/following/${creatorData.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setCreatorData({
          ...creatorData,
          isFollowing: false
        });

        toast.success('Unfollowed successfully');
      } else {
        // Follow the creator
        await axios.post(
          `${API_URL}/users/following`,
          { therapistId: creatorData.id },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setCreatorData({
          ...creatorData,
          isFollowing: true
        });

        toast.success('Following successfully');
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    } finally {
      setIsLoadingFollow(false);
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
        [name]: parseInt(value) || value
      });
    }
  };

  const handleSaveRoutinePopup = () => {
    setFormData({
      reps: exercise?.reps || 1,
      hold: exercise?.hold || 1,
      complete: exercise?.complete || 1,
      perform: {
        count: exercise?.perform?.count || 1,
        type: exercise?.perform?.type || 'day'
      },
      name: exercise?.title
    });
    setShowRoutinePopup(true);
  }

  // Submit form data to create a routine
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warning('Please login to save routine');
      return;
    }

    // Prepare the payload with exercise ID and form data
    const payload = {
      exerciseId: exercise._id,
      name: formData.name,
      reps: formData.reps,
      hold: formData.hold,
      complete: formData.complete,
      perform: formData.perform
    };

    try {
      await axios.post(`${API_URL}/routines`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      // Show success message
      toast.success('Routine saved successfully');

      // Close the popup
      setShowRoutinePopup(false);

    } catch (error) {
      console.error('Error saving routine:', error);
      toast.error('Failed to save routine. Please try again.');
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
    <div className="min-h-screen px-2 sm:px-4 md:px-8 lg:px-16 bg-gray-900 text-white">
      <div className="container mx-auto px-2 sm:px-4 py-6">
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{exercise?.title}</h1>
            </div>

            <div className="aspect-[4/2] w-full">
              <MediaCarousel images={exercise.image} video={isPro ? exercise.video : []} />
            </div>

            {/* Exercise description */}
            <div className="my-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-300">{exercise?.description}</p>
            </div>

            {/* Exercise instructions */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Instructions</h2>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-300 whitespace-pre-line">{exercise?.instruction}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={handleSaveRoutinePopup}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save size={18} />
                <span>Save Routine</span>
              </button>
              <button
                onClick={toggleFavorite}
                disabled={isLoadingFavorite}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${isLoadingFavorite ? 'bg-gray-700 cursor-wait' : isFavorite
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
              >
                <Heart size={18} fill={isFavorite ? 'white' : 'none'} />
                <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
          </div>

          {/* Right column - Recommended parameters and related exercises */}
          <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
            {/* Recommended parameters */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="mr-2 text-purple-400" size={18} />
                Recommended Parameters
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Reps</div>
                  <div className="text-lg font-semibold">{routineData?.reps || exercise?.reps}</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Hold (seconds)</div>
                  <div className="text-lg font-semibold">{routineData?.hold || exercise?.hold}</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Sets</div>
                  <div className="text-lg font-semibold">{routineData?.set || exercise?.set}</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Perform</div>
                  <div className="text-lg font-semibold">
                    {routineData?.perform?.count || exercise?.perform?.count}/{routineData?.perform?.type || exercise?.perform?.type || 'day'}
                  </div>
                </div>
              </div>
            </div>

            {/* Creator info */}
            {creatorData && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
                <h2 className="text-lg font-semibold mb-4">Creator</h2>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {creatorData.name ? creatorData.name.charAt(0) : 'A'}
                    </div>
                    <div className="ml-3">
                      <h3 className='text-sm font-medium text-white'>{exercise.custom?.createdBy === "therapist" && "Dr."} {creatorData.name}</h3>
                      <p className='text-xs text-gray-400'>{creatorData.specializations?.length ? creatorData.specializations.join(" | ") : (exercise.custom?.createdBy === "admin" ? "Admin" : "Pro User")}</p>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                  <button
                    onClick={toggleFollow}
                    disabled={isLoadingFollow}
                    className={`flex items-center justify-center text-sm px-3 py-1 rounded-md transition-colors ${isLoadingFollow
                      ? 'bg-gray-700 text-gray-300 cursor-wait'
                      : creatorData.isFollowing
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                  >
                    {isLoadingFollow ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : creatorData.isFollowing ? (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} className="mr-1" />
                        Follow
                      </>
                    )}
                  </button>
                  <button onClick={() => navigate(`/creator/exercise/${exercise.custom.creatorId}`)} className='border-2 w-full border-purple-700 bg-purple-800 hover:bg-purple-900 hover:text-white text-sm rounded-md px-3 py-1'>View Exercises</button>
                </div>
              </div>
            )}

            {/* Related exercises */}
            {relatedExercises && relatedExercises.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4">Related Exercises</h2>
                <div className="space-y-3">
                  {relatedExercises.map((relatedEx) => (
                    <Link
                      key={relatedEx._id}
                      to={`/exercise/${relatedEx._id}`}
                      className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden mr-3">
                          {relatedEx.image && relatedEx.image.length > 0 ? (
                            <img
                              src={relatedEx.image[0]}
                              alt={relatedEx.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">{relatedEx.title}</div>
                          <div className="text-xs text-gray-400">{relatedEx.category}</div>
                        </div>
                        <ChevronRight size={16} className="text-gray-500" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Routine Popup */}
      {showRoutinePopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-5 w-full max-w-md relative">
            <button
              onClick={() => setShowRoutinePopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6">Save Routine</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Routine Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reps
                  </label>
                  <select
                    name="reps"
                    value={formData.reps}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={`reps-${i + 1}`} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hold (seconds)
                  </label>
                  <select
                    name="hold"
                    value={formData.hold}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[...Array(30)].map((_, i) => (
                      <option key={`hold-${i + 1}`} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Complete
                  </label>
                  <select
                    name="complete"
                    value={formData.complete}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={`complete-${i + 1}`} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Perform
                  </label>
                  <div className="flex">
                    <select
                      name="performCount"
                      value={formData.perform.count}
                      onChange={handleChange}
                      className="w-1/2 px-2 py-2 bg-gray-700 border border-gray-600 rounded-l text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={`count-${i + 1}`} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <select
                      name="performType"
                      value={formData.perform.type}
                      onChange={handleChange}
                      className="w-1/2 px-2 py-2 bg-gray-700 border-l-0 border border-gray-600 rounded-r text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="hour">hour</option>
                      <option value="day">day</option>
                      <option value="week">week</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
              >
                Save Routine
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetailPage;