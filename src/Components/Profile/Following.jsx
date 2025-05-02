import { useState, useEffect } from 'react';
import { User, Briefcase, Phone, MapPin, Award, BookOpen, UserMinus, SquareArrowOutUpRight, Crown, ChevronLeft, Tag } from 'lucide-react';
import MediaCarousel from './MediaCarousel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

// Main component
export default function Following() {
  const [therapists, setTherapists] = useState([]);
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [unfollowLoading, setUnfollowLoading] = useState(null);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [viewingExercisesFor, setViewingExercisesFor] = useState(null);
  const navigate = useNavigate();

  // CSS for transitions
  const styles = {
    therapistsView: {
      opacity: viewingExercisesFor ? '0' : '1',
      transform: viewingExercisesFor ? 'translateY(-20px)' : 'translateY(0)',
      transition: 'opacity 300ms ease, transform 300ms ease',
      position: viewingExercisesFor ? 'absolute' : 'relative',
      visibility: viewingExercisesFor ? 'hidden' : 'visible',
      width: '100%',
      zIndex: viewingExercisesFor ? '0' : '1',
    },
    exercisesView: {
      opacity: viewingExercisesFor ? '1' : '0',
      transform: viewingExercisesFor ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 300ms ease, transform 300ms ease',
      visibility: viewingExercisesFor ? 'visible' : 'hidden',
      position: viewingExercisesFor ? 'relative' : 'absolute',
      width: '100%',
      zIndex: viewingExercisesFor ? '1' : '0',
    },
    backButton: {
      transform: viewingExercisesFor ? 'translateX(0)' : 'translateX(-20px)',
      opacity: viewingExercisesFor ? '1' : '0',
      transition: 'transform 300ms ease, opacity 300ms ease',
      marginRight: '1rem',
      backgroundColor: '#6D28D9', // purple-700
      padding: '0.5rem',
      borderRadius: '9999px',
      cursor: 'pointer',
    }
  };

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
      // If API isn't ready, use dummy data for demonstration
      if (process.env.NODE_ENV === 'development') {
        setTherapists(dummyTherapists);
      }
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
      
      // If API isn't ready, just update UI for demonstration
      if (process.env.NODE_ENV === 'development') {
        setTherapists(therapists.filter(therapist => therapist._id !== id));
      }
    } finally {
      setUnfollowLoading(null);
    }
  };

  // Show exercises for a specific therapist
  const showExercises = async (therapistId) => {
    // Only fetch if we don't already have the exercises
    if (!exercises[therapistId]) {
      setExercisesLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/therapists/${therapistId}/exercises`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setExercises(prev => ({
          ...prev,
          [therapistId]: response.data
        }));
      } catch (err) {
        console.error('Error fetching therapist exercises:', err);
        toast.error('Failed to load exercises');
        
        // If API isn't ready, use dummy data
        if (process.env.NODE_ENV === 'development') {
          setExercises(prev => ({
            ...prev,
            [therapistId]: dummyExercises[therapistId] || []
          }));
        }
      } finally {
        setExercisesLoading(false);
      }
    }
    
    setViewingExercisesFor(therapistId);
  };

  // Go back to therapists view
  const goBackToTherapists = () => {
    setViewingExercisesFor(null);
  };

  // Get current therapist name
  const getCurrentTherapistName = () => {
    const therapist = therapists.find(t => t._id === viewingExercisesFor);
    return therapist ? therapist.name || therapist.fullName : '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <svg className="animate-spin h-8 w-8 text-purple-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-purple-400">Loading therapists...</span>
      </div>
    );
  }

  // Dummy data for therapists
  const dummyTherapists = [
    {
      _id: '1',
      name: 'Dr. Sarah Johnson',
      fullName: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      gender: 'female',
      specializations: ['Depression', 'Anxiety', 'Trauma'],
      workingAt: 'Serenity Wellness Center',
      address: '123 Healing Ave, Mindful City, MC 12345',
      phoneNumber: '5551234567',
      experience: '10 years'
    },
    {
      _id: '2',
      name: 'Dr. Michael Chen',
      fullName: 'Dr. Michael Chen',
      email: 'michael.chen@example.com',
      gender: 'male',
      specializations: ['ADHD', 'Stress Management', 'Behavioral Therapy'],
      workingAt: 'Balance Mental Health Clinic',
      address: '456 Therapy Blvd, Wellness Town, WT 67890',
      phoneNumber: '5559876543',
      experience: '8 years'
    },
    {
      _id: '3',
      name: 'Dr. Amara Wilson',
      fullName: 'Dr. Amara Wilson',
      email: 'amara.wilson@example.com',
      gender: 'female',
      specializations: ['Family Therapy', 'Marriage Counseling', 'Child Psychology'],
      workingAt: 'Harmony Family Services',
      address: '789 Support St, Tranquil Hills, TH 45678',
      phoneNumber: '5552223333',
      experience: '15 years'
    }
  ];

  // Dummy data for exercises based on the updated schema
  const dummyExercises = {
    '1': [
      {
        _id: 'e1',
        title: 'Mindful Breathing',
        description: 'A simple breathing technique to reduce anxiety and increase focus',
        instruction: '1. Sit comfortably with your back straight.\n2. Breathe in deeply for 4 counts.\n3. Hold for 2 counts.\n4. Exhale slowly for 6 counts.\n5. Repeat for 5 minutes.',
        video: ['https://example.com/mindful-breathing.mp4'],
        image: ['https://example.com/mindful-breathing.jpg'],
        category: 'Anxiety Management',
        subCategory: 'Breathing Techniques',
        position: 'Seated',
        isPremium: false
      },
      {
        _id: 'e2',
        title: 'Thought Journal',
        description: 'Record and challenge negative thought patterns',
        instruction: '1. Write down your negative thoughts.\n2. Identify the cognitive distortion.\n3. Challenge the thought with evidence.\n4. Create an alternative balanced thought.',
        video: [],
        image: ['https://example.com/thought-journal.jpg'],
        category: 'Cognitive Restructuring',
        subCategory: 'Journaling',
        position: 'Any',
        isPremium: false
      },
      {
        _id: 'e3',
        title: 'Progressive Muscle Relaxation',
        description: 'Systematically relax your muscle groups to reduce physical tension',
        instruction: '1. Lie down in a comfortable position.\n2. Start with your feet, tense the muscles for 5 seconds.\n3. Release and notice the feeling of relaxation.\n4. Move up through each muscle group in your body.\n5. End with facial muscles.',
        video: ['https://example.com/pmr.mp4'],
        image: ['https://example.com/pmr1.jpg', 'https://example.com/pmr2.jpg'],
        category: 'Stress Management',
        subCategory: 'Physical Techniques',
        position: 'Lying down',
        isPremium: true
      }
    ],
    '2': [
      {
        _id: 'e4',
        title: 'Focus Exercise',
        description: 'Improve attention span and concentration',
        instruction: '1. Choose one simple object.\n2. Focus all your attention on it for 5 minutes.\n3. When your mind wanders, gently bring it back.\n4. Gradually increase duration over time.',
        video: ['https://example.com/focus.mp4'],
        image: [],
        category: 'ADHD Management',
        subCategory: 'Concentration',
        position: 'Seated',
        isPremium: false
      },
      {
        _id: 'e5',
        title: 'Time Management Planning',
        description: 'Create structured schedules to improve productivity',
        instruction: '1. Identify your most important tasks for the day.\n2. Break larger tasks into smaller, manageable steps.\n3. Assign specific time blocks for each task.\n4. Include short breaks between focused work periods.\n5. Review and adjust your schedule as needed.',
        video: [],
        image: ['https://example.com/time-management.jpg'],
        category: 'Executive Function',
        subCategory: 'Planning',
        position: 'Any',
        isPremium: true
      }
    ],
    '3': [
      {
        _id: 'e6',
        title: 'Family Communication Circle',
        description: 'Improve family communication patterns',
        instruction: '1. Have family members sit in a circle.\n2. Use a "talking object" - only the person holding it may speak.\n3. Each person shares their feelings on a specific topic.\n4. Others practice active listening without interrupting.\n5. After everyone shares, open for respectful discussion.',
        video: ['https://example.com/family-circle.mp4'],
        image: ['https://example.com/family-circle.jpg'],
        category: 'Family Therapy',
        subCategory: 'Communication',
        position: 'Seated in circle',
        isPremium: false
      },
      {
        _id: 'e7',
        title: 'Empathy Building',
        description: 'Practice understanding and reflecting others\' emotions',
        instruction: '1. Take turns describing a recent emotional experience.\n2. The listener reflects back what they heard without judgment.\n3. The speaker confirms or clarifies the reflection.\n4. Switch roles and repeat.',
        video: [],
        image: ['https://example.com/empathy.jpg'],
        category: 'Relationship',
        subCategory: 'Emotional Intelligence',
        position: 'Face to face',
        isPremium: false
      },
      {
        _id: 'e8',
        title: 'Child-Parent Bonding',
        description: 'Structured activities to strengthen the parent-child relationship',
        instruction: '1. Set aside 30 minutes of uninterrupted time.\n2. Let the child choose the activity.\n3. Follow the child\'s lead without directing.\n4. Provide positive attention and validation.\n5. Reflect the child\'s emotions and actions.',
        video: ['https://example.com/parent-child1.mp4', 'https://example.com/parent-child2.mp4'],
        image: ['https://example.com/parent-child.jpg'],
        category: 'Child Psychology',
        subCategory: 'Attachment',
        position: 'Various',
        isPremium: true
      }
    ]
  };

  return (
    <div className="bg-gray-900 relative p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={goBackToTherapists}
          className="focus:outline-none"
          style={styles.backButton}
          aria-label="Back to therapists"
        >
          <ChevronLeft size={20} color="white" />
        </button>
        <h1 className="text-3xl font-bold text-white">
          {viewingExercisesFor 
            ? `${getCurrentTherapistName()}'s Exercises` 
            : 'Therapists you Follow'
          }
        </h1>
      </div>

      {/* Therapists Grid */}
      <div style={styles.therapistsView}>
        {therapists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {therapists.map(therapist => (
              <div 
                key={therapist._id} 
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl hover:border-purple-500 hover:border border border-transparent transition-all duration-200"
                onClick={() => showExercises(therapist._id)}
              >
                {/* Therapist Header */}
                <div className="p-5 bg-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white mr-3">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{therapist.name || therapist.fullName}</h3>
                      <div className="text-gray-300 text-xs">{therapist.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleUnfollow(therapist._id, e)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition"
                    disabled={unfollowLoading === therapist._id}
                  >
                    {unfollowLoading === therapist._id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <UserMinus size={20} />
                    )}
                  </button>
                </div>

                {/* Therapist Info */}
                <div className="p-5">
                  {/* Specializations */}
                  <div className="mb-4">
                    <div className="text-purple-400 font-medium mb-2 flex items-center">
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
                  <div className="mt-4 text-center">
                    <button 
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 px-4 w-full flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        showExercises(therapist._id);
                      }}
                    >
                      <SquareArrowOutUpRight size={16} className="mr-1" />
                      View Exercises
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-purple-400 italic mb-6">You're not following any therapists yet</p>
            <button onClick={() => navigate('/therapists')} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition">
              Browse Therapists
            </button>
          </div>
        )}
      </div>

      {/* Exercises View */}
      <div style={styles.exercisesView}>
        {exercisesLoading ? (
          <div className="flex justify-center items-center p-8">
            <svg className="animate-spin h-8 w-8 text-purple-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-purple-400">Loading exercises...</span>
          </div>
        ) : (
          <>
            {viewingExercisesFor && exercises[viewingExercisesFor] && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exercises[viewingExercisesFor].length > 0 ? (
                  exercises[viewingExercisesFor].map(exercise => (
                    <div 
                      key={exercise._id} 
                      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col"
                    >
                      {/* Media */}
                      {(exercise.video?.length > 0 || exercise.image?.length > 0) && (
                        <div className="min-h-[200px]">
                          <MediaCarousel videos={exercise.video || []} images={exercise.image || []} />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-5 flex-grow flex flex-col">
                        {/* Title with premium badge if applicable */}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-white text-lg font-medium">{exercise.title}</h3>
                          {exercise.isPremium && (
                            <span className="bg-yellow-500 text-gray-900 text-xs px-2 py-1 rounded-full flex items-center">
                              <Crown size={12} className="mr-1" /> Premium
                            </span>
                          )}
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{exercise.description}</p>
                        
                        {/* Categories and Position */}
                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-purple-900 text-purple-100 text-xs px-2 py-1 rounded-full flex items-center">
                              <Tag size={10} className="mr-1" /> {exercise.category}
                            </span>
                            <span className="bg-purple-800 text-purple-100 text-xs px-2 py-1 rounded-full">
                              {exercise.subCategory}
                            </span>
                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                              {exercise.position}
                            </span>
                          </div>
                          
                          {/* View Full Exercise Button */}
                          <button 
                            className="mt-2 text-center w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
                            onClick={() => navigate(`/exercise/${exercise._id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 bg-gray-800 rounded-lg">
                    <p className="text-gray-400 italic">This therapist hasn't added any exercises yet</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}