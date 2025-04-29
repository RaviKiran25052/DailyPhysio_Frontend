import { useState, useEffect } from 'react';
import { X, User, Briefcase, Phone, MapPin, Award, ChevronDown, ChevronUp, Trash2, BookOpen, Play, Image, Lock, Tag, UserMinus, SquareArrowOutUpRight, Crown } from 'lucide-react';
import MediaCarousel from './MediaCarousel';
import { useNavigate } from 'react-router-dom';

// Dummy data for therapists
const dummyTherapists = [
  {
    _id: '1',
    name: 'Dr. Sarah Johnson',
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
      subcategory: 'Breathing Techniques',
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
      subcategory: 'Journaling',
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
      subcategory: 'Physical Techniques',
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
      subcategory: 'Concentration',
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
      subcategory: 'Planning',
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
      subcategory: 'Communication',
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
      subcategory: 'Emotional Intelligence',
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
      subcategory: 'Attachment',
      position: 'Various',
      isPremium: true
    }
  ]
};

// Main component
export default function Following() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTherapist, setExpandedTherapist] = useState(null);
  const navigate = useNavigate();

  // Fetch therapists data
  useEffect(() => {
    // In a real app, this would use axios to fetch from an API
    // const API_URL = process.env.REACT_APP_API_URL;
    // axios.get(`${API_URL}/therapists`)
    //   .then(response => {
    //     setTherapists(response.data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError('Failed to fetch therapists');
    //     setLoading(false);
    //   });

    // Using dummy data for now
    setTherapists(dummyTherapists);
    setLoading(false);
  }, []);

  // Delete therapist handler
  const handleDelete = (id) => {
    // In a real app, this would make an API call
    // axios.delete(`${API_URL}/therapists/${id}`)
    //   .then(() => {
    //     setTherapists(therapists.filter(therapist => therapist._id !== id));
    //   })
    //   .catch(err => {
    //     setError('Failed to delete therapist');
    //   });

    // Using dummy data for now
    setTherapists(therapists.filter(therapist => therapist._id !== id));
  };

  // Toggle exercises view
  const toggleExercises = (id) => {
    setExpandedTherapist(expandedTherapist === id ? null : id);
  };

  if (loading) return <div className="flex justify-center p-8">Loading therapists...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Therapists you Follow</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {therapists.map(therapist => (
          <div key={therapist._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
            {/* Therapist Header */}
            <div className="bg-purple-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">{therapist.name}</h2>
              <button
                onClick={() => handleDelete(therapist._id)}
                className="text-white bg-gray-900 text-sm flex px-3 py-2 rounded-md hover:text-red-500 transition"
                aria-label="Delete therapist"
              >
                <UserMinus size={16} className='mr-2' />Unfollow
              </button>
            </div>

            {/* Therapist Basic Info */}
            <div className="p-4 text-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-purple-400" />
                <span>{therapist.email}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Briefcase size={16} className="text-purple-400" />
                <span>{therapist.workingAt}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Phone size={16} className="text-purple-400" />
                <span>{therapist.phoneNumber}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-purple-400" />
                <span className="line-clamp-1">{therapist.address}</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Award size={16} className="text-purple-400" />
                <span>{therapist.experience}</span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">Specializations:</p>
                <div className="flex flex-wrap gap-2">
                  {therapist.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="bg-purple-900 text-purple-200 px-2 py-1 rounded-full text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toggleExercises(therapist._id)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center justify-center w-full transition"
              >
                <BookOpen size={16} className="mr-2" />
                View Exercises
                <ChevronUp size={16} className="ml-2" />
              </button>
            </div>

            {/* Exercises Panel - Slides up from bottom */}
            <div
              className={`absolute inset-0 bg-gray-800 transition-transform duration-300 ease-in-out transform ${expandedTherapist === therapist._id ? 'translate-y-0' : 'translate-y-full'
                }`}
              style={{ height: '100%' }}
            >
              <div className="bg-purple-700 p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Exercises</h3>
                <button
                  onClick={() => toggleExercises(therapist._id)}
                  className="text-white hover:text-gray-200 transition"
                  aria-label="Close exercises"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              <div className="p-4 h-[calc(100%-60px)] overflow-y-auto max-h-full">
                {dummyExercises[therapist._id]?.length > 0 ? (
                  <div className="space-y-4">
                    {dummyExercises[therapist._id].map(exercise => (
                      <div key={exercise._id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 relative">
                        <div className='min-h-[200px]'>
                          <MediaCarousel images={exercise.image} videos={exercise.video} />
                        </div>
                        <h4 onClick={() => navigate(`/exercise/${exercise._id}`)} className="flex gap-2 pb-4 font-medium cursor-pointer hover:text-purple-300 text-lg">{exercise.title}<SquareArrowOutUpRight size={14} /></h4>
                        {exercise.isPremium && (
                          <span className="absolute top-3 left-3 bg-yellow-600 text-yellow-100 px-2 py-1 rounded-full text-xs flex items-center">
                            <Crown size={12} className="mr-1" /> Premium
                          </span>
                        )}

                        <p className="text-gray-300 mb-3">{exercise.description}</p>

                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                          <Tag size={14} className="text-purple-400" />
                          <span>{exercise.category} / {exercise.subcategory}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                          <User size={14} className="text-purple-400" />
                          <span>Position: {exercise.position}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <BookOpen size={48} className="mb-4 opacity-50" />
                    <p>No exercises available for this therapist.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}