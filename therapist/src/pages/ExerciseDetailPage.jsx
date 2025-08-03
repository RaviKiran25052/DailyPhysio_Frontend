import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Activity } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import MediaCarousel from '../components/Exercises/MediaCarousel';

const API_URL = process.env.REACT_APP_API_URL || '';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [exercise, setExercise] = useState([]);
  const [relatedExercises, setRelatedExercises] = useState([]);
  const [creatorData, setCreatorData] = useState({});

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const therapist = localStorage.getItem('therapistInfo')
          ? JSON.parse(localStorage.getItem('therapistInfo'))
          : null;
        const response = await axios.get(`${API_URL}/exercises/${id}`, {
          headers: {
            Authorization: `Bearer ${therapist.token}`
          }
        });
        const data = response.data;
        setExercise(data.exercise);
        setCreatorData(data.creatorData);
        setRelatedExercises(data.relatedExercises);
      } catch (error) {
        console.error('Error fetching exercise:', error);
        toast.error('Failed to load exercise');
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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
          className="px-4 py-2 bg-primary-600 rounded-md hover:bg-primary-700 transition"
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
            className="flex items-center text-gray-300 hover:text-primary-400 transition-colors"
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
                <span className="text-xs bg-primary-900/60 text-primary-300 px-2 py-1 rounded-full">
                  {exercise?.category}
                </span>
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                  {exercise?.position}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">{exercise?.title}</h1>
            </div>

            <div className="aspect-[4/2] w-full">
              <MediaCarousel images={exercise.image} video={exercise.video} />
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
          </div>

          {/* Right column - Recommended parameters and related exercises */}
          <div className="w-full lg:w-1/3 mt-4 lg:mt-0">
            {/* Recommended parameters */}
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="mr-2 text-primary-400" size={18} />
                Recommended Parameters
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Reps</div>
                  <div className="text-lg font-semibold">{exercise?.reps}</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Hold (seconds)</div>
                  <div className="text-lg font-semibold">{exercise?.hold}</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Sets</div>
                  <div className="text-lg font-semibold">{exercise?.set}</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Perform</div>
                  <div className="text-lg font-semibold">
                    {exercise?.perform?.count}/{exercise?.perform?.type || 'day'}
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
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {creatorData.name ? creatorData.name.charAt(0) : 'A'}
                    </div>
                    <div className="ml-3">
                      <h3 className='text-sm font-medium text-white'>{exercise.custom?.createdBy === "therapist" && "Dr."} {creatorData.name}</h3>
                      <p className='text-xs text-gray-400'>{creatorData.specializations?.length ? creatorData.specializations.join(" | ") : (exercise.custom?.createdBy === "admin" ? "Admin" : "Pro User")}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => navigate(`/creator/exercise/${exercise.custom.creatorId}`)} className='border-2 w-full border-primary-700 bg-primary-800 hover:bg-primary-900 hover:text-white text-sm rounded-md px-3 py-1'>View Exercises</button>
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
    </div>
  );
};

export default ExerciseDetailPage;