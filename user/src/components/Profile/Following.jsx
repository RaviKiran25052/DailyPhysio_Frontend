import { useState, useEffect } from 'react';
import { User, Briefcase, Phone, MapPin, Award, BookOpen, UserMinus, SquareArrowOutUpRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

// Main component
export default function Following() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unfollowLoading, setUnfollowLoading] = useState(null);
  const navigate = useNavigate();

  // Fetch therapists data
  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/following`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTherapists(response.data);
    } catch (err) {
      console.error('Error fetching following:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete therapist handler (unfollow)
  const handleUnfollow = async (id, e) => {
    e.stopPropagation(); // Prevent triggering showExercises
    setUnfollowLoading(id);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/users/following/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update state locally
      setTherapists(therapists.filter(therapist => therapist._id !== id));
      toast.success('Unfollowed successfully');
    } catch (err) {
      console.error('Error unfollowing therapist:', err);
      toast.error('Failed to unfollow. Please try again.');
    } finally {
      setUnfollowLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <svg className="animate-spin h-8 w-8 text-primary-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-primary-400">Loading therapists...</span>
      </div>
    );
  }

  return (
    <div className="bg-primary-800 rounded-xl relative p-4 md:p-6">
      {/* Header */}
      <h1 className="text-xl md:text-2xl flex items-center font-semibold text-white mb-4">
        Therapists you Follow
      </h1>

      {/* Therapists Grid */}
      {therapists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {therapists.map(therapist => (
            <div
              key={therapist._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:border-primary-500 hover:border border border-transparent transition-all duration-200"
            >
              {/* Therapist Header */}
              <div className="p-5 bg-primary-700 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white mr-3">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{therapist.name || therapist.fullName}</h3>
                    <div className="text-gray-300 text-xs">{therapist.email}</div>
                  </div>
                </div>
              </div>

              {/* Therapist Info */}
              <div className="p-5">
                {/* Specializations */}
                <div className="mb-4">
                  <div className="text-primary-400 font-medium mb-2 flex items-center">
                    <Award size={16} className="mr-1" /> Specializations
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {therapist.specializations?.map((spec, i) => (
                      <span key={i} className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  {therapist.workingAt && (
                    <div className="flex items-center text-gray-300">
                      <Briefcase size={14} className="mr-2 text-gray-400" />
                      <span>{therapist.workingAt}</span>
                    </div>
                  )}

                  {therapist.phoneNumber && (
                    <div className="flex items-center text-gray-300">
                      <Phone size={14} className="mr-2 text-gray-400" />
                      <span>{therapist.phoneNumber}</span>
                    </div>
                  )}

                  {therapist.address && (
                    <div className="flex items-center text-gray-300">
                      <MapPin size={14} className="mr-2 text-gray-400" />
                      <span>{therapist.address}</span>
                    </div>
                  )}

                  {therapist.experience && (
                    <div className="flex items-center text-gray-300">
                      <BookOpen size={14} className="mr-2 text-gray-400" />
                      <span>Experience: {therapist.experience}</span>
                    </div>
                  )}
                </div>

                {/* View Exercises Button */}
                <div className="flex items-center gap-3 mt-4 text-center text-sm md:text-base">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white rounded-md py-1 px-3 w-full flex gap-1 items-center justify-center"
                    onClick={(e) => handleUnfollow(therapist._id, e)}
                    disabled={unfollowLoading === therapist._id}
                  >
                    {unfollowLoading === therapist._id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="flex items-center gap-1">
                        <UserMinus size={16} className="mr-1" />
                        Unfollow
                      </span>
                    )}
                  </button>
                  <button
                    className="bg-primary-600 hover:bg-primary-700 text-white rounded-md py-1 px-3 w-full flex gap-1 items-center justify-center"
                    onClick={() => navigate(`/creator/exercise/${therapist._id}`)}
                  >
                    <Eye size={16} className="mr-1" />
                    Exercises
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-primary-400 italic mb-6">You're not following any therapists yet</p>
        </div>
      )}
    </div>
  );
}