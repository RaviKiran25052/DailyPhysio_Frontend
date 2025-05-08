import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, Briefcase, Clock, Users, Eye, Heart, Tag, Film } from 'lucide-react';

const TrendingSection = () => {
    const [trendingTherapists, setTrendingTherapists] = useState([]);
    const [trendingExercises, setTrendingExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for carousel positioning
    const [therapistStartIdx, setTherapistStartIdx] = useState(0);
    const [exerciseStartIdx, setExerciseStartIdx] = useState(0);

    // State for image carousels within cards
    const [cardImageIndices, setCardImageIndices] = useState({});

    // Determine visible cards count based on screen width
    const [visibleCards, setVisibleCards] = useState(3);

    useEffect(() => {
        // Handle responsive card display
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // desktop
                setVisibleCards(3);
            } else if (window.innerWidth >= 768) { // tablet
                setVisibleCards(2);
            } else { // mobile
                setVisibleCards(1);
            }
        };

        // Initial check
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchTrendingData = async () => {
            setLoading(true);
            try {
                // Using a try-catch block to handle potential API errors
                const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';
                const response = await fetch(`${API_URL}/public/trending`);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const responseData = await response.json();
                const data = responseData.data;

                let exercises = [];
                if (data?.trendingExercises?.length) {
                    exercises = data.trendingExercises;
                } else {
                    // Fallback data
                    exercises = [
                        {
                            _id: '1',
                            title: 'Morning Mindfulness Meditation',
                            description: 'Start your day with this calming 10-minute meditation to center yourself and prepare for the day ahead.',
                            instruction: 'Find a quiet space, sit comfortably, and focus on your breath for 10 minutes.',
                            video: 'https://example.com/video.mp4',
                            image: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
                            views: 12540,
                            favorites: 3250,
                            category: 'Meditation',
                            subCategory: 'Mindfulness',
                            position: 'Seated'
                        },
                        {
                            _id: '2',
                            title: 'Anxiety Relief Breathing Technique',
                            description: 'A simple but powerful breathing exercise to quickly reduce anxiety in stressful situations.',
                            instruction: 'Breathe in for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 5 times.',
                            video: 'https://example.com/video2.mp4',
                            image: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
                            views: 9870,
                            favorites: 2780,
                            category: 'Stress Management',
                            subCategory: 'Breathing',
                            position: 'Any'
                        },
                        {
                            _id: '3',
                            title: 'Progressive Muscle Relaxation',
                            description: 'Systematically tense and relax different muscle groups to reduce physical tension and mental stress.',
                            instruction: 'Start from your toes and work up to your head, tensing each muscle group for 5 seconds then releasing.',
                            video: 'https://example.com/video3.mp4',
                            image: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
                            views: 8650,
                            favorites: 2100,
                            category: 'Relaxation',
                            subCategory: 'Physical',
                            position: 'Lying down'
                        },
                        {
                            _id: '4',
                            title: 'Gratitude Journaling Exercise',
                            description: 'Daily practice to focus on positive aspects of life and improve overall mental wellbeing.',
                            instruction: "Write down 3 things you're grateful for each day, and why they matter to you.",
                            video: '',
                            image: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
                            views: 7890,
                            favorites: 1950,
                            category: 'Positive Psychology',
                            subCategory: 'Journaling',
                            position: 'Seated'
                        },
                        {
                            _id: '5',
                            title: 'Body Scan Meditation',
                            description: 'Increase body awareness and release tension through focused attention on different body parts.',
                            instruction: 'Lie down comfortably and mentally scan your body from head to toe, noting sensations without judgment.',
                            video: 'https://example.com/video5.mp4',
                            image: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
                            views: 6540,
                            favorites: 1600,
                            category: 'Meditation',
                            subCategory: 'Body Awareness',
                            position: 'Lying down'
                        }
                    ];
                }

                let therapists = [];
                if (data?.trendingTherapists?.length) {
                    therapists = data.trendingTherapists;
                } else {
                    // Fallback data
                    therapists = [
                        {
                            _id: '1',
                            name: 'Dr. Sarah Johnson',
                            email: 'sarah.johnson@example.com',
                            gender: 'female',
                            specializations: ['Cognitive Behavioral Therapy', 'Anxiety Disorders', 'Depression'],
                            workingAt: 'Wellness Center',
                            address: '123 Healing St, Mindful City',
                            phoneNumber: '1234567890',
                            experience: '12 years',
                            status: 'active',
                            consultationCount: 234,
                            followers: 1250,
                            profileImage: '/api/placeholder/400/300'
                        },
                        {
                            _id: '2',
                            name: 'Dr. Michael Chen',
                            email: 'michael.chen@example.com',
                            gender: 'male',
                            specializations: ['Mindfulness', 'Stress Management', 'PTSD'],
                            workingAt: 'Serenity Clinic',
                            address: '456 Calm Ave, Peaceful Town',
                            phoneNumber: '0987654321',
                            experience: '8 years',
                            status: 'active',
                            consultationCount: 189,
                            followers: 980,
                            profileImage: '/api/placeholder/400/300'
                        },
                        {
                            _id: '3',
                            name: 'Dr. Amara Rodriguez',
                            email: 'amara.rodriguez@example.com',
                            gender: 'female',
                            specializations: ['Family Therapy', 'Relationship Counseling', 'Child Psychology'],
                            workingAt: 'Family Wellness Institute',
                            address: '789 Harmony Blvd, Unity Springs',
                            phoneNumber: '5556667777',
                            experience: '15 years',
                            status: 'active',
                            consultationCount: 312,
                            followers: 1580,
                            profileImage: '/api/placeholder/400/300'
                        },
                        {
                            _id: '4',
                            name: 'Dr. James Wilson',
                            email: 'james.wilson@example.com',
                            gender: 'male',
                            specializations: ['Addiction Recovery', 'Trauma Therapy', 'Group Therapy'],
                            workingAt: 'Recovery Center',
                            address: '101 Renewal Rd, Hope Valley',
                            phoneNumber: '3334445555',
                            experience: '10 years',
                            status: 'active',
                            consultationCount: 201,
                            followers: 870,
                            profileImage: '/api/placeholder/400/300'
                        },
                        {
                            _id: '5',
                            name: 'Dr. Zara Ahmed',
                            email: 'zara.ahmed@example.com',
                            gender: 'female',
                            specializations: ['Grief Counseling', 'Cultural Therapy', 'EMDR'],
                            workingAt: 'Holistic Healing Center',
                            address: '202 Balance Way, Tranquil Heights',
                            phoneNumber: '7778889999',
                            experience: '9 years',
                            status: 'active',
                            consultationCount: 178,
                            followers: 920,
                            profileImage: '/api/placeholder/400/300'
                        }
                    ];
                }

                setTrendingExercises(exercises);
                setTrendingTherapists(therapists);

                // Initialize image carousel indices for each card
                const imageIndices = {};
                exercises.forEach(exercise => {
                    imageIndices[exercise._id] = 0;
                });
                setCardImageIndices(imageIndices);

            } catch (error) {
                console.error('Error fetching trending data:', error);

                // Set fallback data if fetch fails
                const therapists = [
                    {
                        _id: '1',
                        name: 'Dr. Sarah Johnson',
                        email: 'sarah.johnson@example.com',
                        gender: 'female',
                        specializations: ['Cognitive Behavioral Therapy', 'Anxiety Disorders', 'Depression'],
                        workingAt: 'Wellness Center',
                        address: '123 Healing St, Mindful City',
                        phoneNumber: '1234567890',
                        experience: '12 years',
                        status: 'active',
                        consultationCount: 234,
                        followers: 1250,
                        profileImage: '/api/placeholder/400/300'
                    },
                    {
                        _id: '2',
                        name: 'Dr. Michael Chen',
                        email: 'michael.chen@example.com',
                        gender: 'male',
                        specializations: ['Mindfulness', 'Stress Management', 'PTSD'],
                        workingAt: 'Serenity Clinic',
                        address: '456 Calm Ave, Peaceful Town',
                        phoneNumber: '0987654321',
                        experience: '8 years',
                        status: 'active',
                        consultationCount: 189,
                        followers: 980,
                        profileImage: '/api/placeholder/400/300'
                    },
                    {
                        _id: '3',
                        name: 'Dr. Amara Rodriguez',
                        email: 'amara.rodriguez@example.com',
                        gender: 'female',
                        specializations: ['Family Therapy', 'Relationship Counseling', 'Child Psychology'],
                        workingAt: 'Family Wellness Institute',
                        address: '789 Harmony Blvd, Unity Springs',
                        phoneNumber: '5556667777',
                        experience: '15 years',
                        status: 'active',
                        consultationCount: 312,
                        followers: 1580,
                        profileImage: '/api/placeholder/400/300'
                    }
                ];

                const exercises = [
                    {
                        _id: '1',
                        title: 'Morning Mindfulness Meditation',
                        description: 'Start your day with this calming 10-minute meditation to center yourself and prepare for the day ahead.',
                        instruction: 'Find a quiet space, sit comfortably, and focus on your breath for 10 minutes.',
                        video: 'https://example.com/video.mp4',
                        image: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
                        views: 12540,
                        favorites: 3250,
                        category: 'Meditation',
                        subCategory: 'Mindfulness',
                        position: 'Seated'
                    },
                    {
                        _id: '2',
                        title: 'Anxiety Relief Breathing Technique',
                        description: 'A simple but powerful breathing exercise to quickly reduce anxiety in stressful situations.',
                        instruction: 'Breathe in for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 5 times.',
                        video: 'https://example.com/video2.mp4',
                        image: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
                        views: 9870,
                        favorites: 2780,
                        category: 'Stress Management',
                        subCategory: 'Breathing',
                        position: 'Any'
                    },
                    {
                        _id: '3',
                        title: 'Progressive Muscle Relaxation',
                        description: 'Systematically tense and relax different muscle groups to reduce physical tension and mental stress.',
                        instruction: 'Start from your toes and work up to your head, tensing each muscle group for 5 seconds then releasing.',
                        video: 'https://example.com/video3.mp4',
                        image: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
                        views: 8650,
                        favorites: 2100,
                        category: 'Relaxation',
                        subCategory: 'Physical',
                        position: 'Lying down'
                    }
                ];

                setTrendingTherapists(therapists);
                setTrendingExercises(exercises);

                // Initialize image carousel indices for each card
                const imageIndices = {};
                exercises.forEach(exercise => {
                    imageIndices[exercise._id] = 0;
                });
                setCardImageIndices(imageIndices);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingData();
    }, []);

    // Navigation functions for main carousels
    const nextTherapists = () => {
        setTherapistStartIdx(prev =>
            Math.min(prev + 1, Math.max(0, trendingTherapists.length - visibleCards))
        );
    };

    const prevTherapists = () => {
        setTherapistStartIdx(prev => Math.max(0, prev - 1));
    };

    const nextExercises = () => {
        setExerciseStartIdx(prev =>
            Math.min(prev + 1, Math.max(0, trendingExercises.length - visibleCards))
        );
    };

    const prevExercises = () => {
        setExerciseStartIdx(prev => Math.max(0, prev - 1));
    };

    // Navigation functions for image carousels
    const nextImage = (cardId, maxImages) => {
        setCardImageIndices(prev => ({
            ...prev,
            [cardId]: (prev[cardId] + 1) % maxImages
        }));
    };

    const prevImage = (cardId, maxImages) => {
        setCardImageIndices(prev => ({
            ...prev,
            [cardId]: (prev[cardId] - 1 + maxImages) % maxImages
        }));
    };

    // Helper component for loading skeleton
    const SkeletonCard = () => (
        <div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl animate-pulse w-full">
            <div className="w-full h-48 bg-gray-600"></div>
            <div className="p-6">
                <div className="h-6 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded mb-4"></div>
                <div className="flex justify-between">
                    <div className="h-3 w-20 bg-gray-600 rounded"></div>
                    <div className="h-3 w-20 bg-gray-600 rounded"></div>
                </div>
            </div>
        </div>
    );

    // Generate loading skeletons
    const renderSkeletons = (count) => {
        return Array(count).fill(0).map((_, index) => (
            <div key={`skeleton-${index}`} className="px-2 w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
                <SkeletonCard />
            </div>
        ));
    };

    return (
        <div className="py-16 bg-gray-800">
            <div className="container mx-auto px-4">
                {/* Trending Therapists */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Top Therapists
                    </h2>

                    {loading ? (
                        <div className="flex space-x-4 overflow-hidden">
                            {renderSkeletons(3)}
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="flex overflow-hidden">
                                {trendingTherapists.slice(therapistStartIdx, therapistStartIdx + visibleCards).map((therapist, index) => (
                                    <div key={therapist._id} className={`px-2 w-full md:w-1/2 lg:w-1/3 flex-shrink-0`}>
                                        <div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl hover:shadow-purple-700/20 transition-shadow h-full relative">
                                            {/* Card number overlay */}
                                            <div className="absolute top-3 left-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                                                {therapistStartIdx + index + 1}
                                            </div>

                                            <div className="relative">
                                                <img
                                                    src={therapist.profileImage || '/api/placeholder/400/300'}
                                                    alt={therapist.name}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg flex items-center">
                                                    <span className="capitalize">{therapist.gender}</span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {therapist.name}
                                                </h3>

                                                <div className="mb-4">
                                                    <div className="flex flex-wrap gap-1 mb-2">
                                                        {therapist.specializations?.slice(0, 2).map((spec, index) => (
                                                            <span key={index} className="bg-purple-900/40 text-purple-200 text-xs px-2 py-1 rounded">
                                                                {spec}
                                                            </span>
                                                        ))}
                                                        {therapist.specializations?.length > 2 && (
                                                            <span className="bg-purple-900/40 text-purple-200 text-xs px-2 py-1 rounded">
                                                                +{therapist.specializations.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-300 mb-4">
                                                    <div className="flex items-center">
                                                        <Briefcase size={16} className="mr-2 text-purple-400" />
                                                        <span>{therapist.workingAt}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock size={16} className="mr-2 text-purple-400" />
                                                        <span>{therapist.experience} experience</span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between text-sm text-gray-400 pt-3 border-t border-gray-600">
                                                    <div className="flex items-center">
                                                        <Briefcase size={16} className="mr-1" />
                                                        <span>{therapist.consultationCount} sessions</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users size={16} className="mr-1" />
                                                        <span>{therapist.followers} followers</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation buttons */}
                            {trendingTherapists.length > visibleCards && (
                                <div className="flex justify-center mt-4 space-x-4">
                                    <button
                                        onClick={prevTherapists}
                                        disabled={therapistStartIdx === 0}
                                        className={`p-2 rounded-full ${therapistStartIdx === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}
                                        aria-label="Previous therapists"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextTherapists}
                                        disabled={therapistStartIdx >= trendingTherapists.length - visibleCards}
                                        className={`p-2 rounded-full ${therapistStartIdx >= trendingTherapists.length - visibleCards ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}
                                        aria-label="Next therapists"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Trending Exercises */}
                <section>
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Trending Exercises
                    </h2>

                    {loading ? (
                        <div className="flex space-x-4 overflow-hidden">
                            {renderSkeletons(3)}
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="flex overflow-hidden">
                                {trendingExercises.slice(exerciseStartIdx, exerciseStartIdx + visibleCards).map((exercise, index) => (
                                    <div key={exercise._id} className={`px-2 w-full md:w-1/2 lg:w-1/3 flex-shrink-0`}>
                                        <div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl hover:shadow-purple-700/20 transition-shadow h-full relative">
                                            {/* Card number overlay */}
                                            <div className="absolute top-3 left-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                                                {exerciseStartIdx + index + 1}
                                            </div>

                                            <div className="relative">
                                                {/* Image carousel */}
                                                {exercise.image && exercise.image.length > 0 && (
                                                    <>
                                                        <div className="w-full h-48 relative overflow-hidden">
                                                            {exercise.image.map((img, imgIndex) => (
                                                                <img
                                                                    key={imgIndex}
                                                                    src={img || '/api/placeholder/400/300'}
                                                                    alt={`${exercise.title} - image ${imgIndex + 1}`}
                                                                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${imgIndex === cardImageIndices[exercise._id] ? 'opacity-100' : 'opacity-0'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Image carousel navigation */}
                                                        {exercise.image.length > 1 && (
                                                            <div className="absolute bottom-2 left-2 flex space-x-1">
                                                                {exercise.image.map((_, imgIndex) => (
                                                                    <div
                                                                        key={imgIndex}
                                                                        className={`w-2 h-2 rounded-full ${imgIndex === cardImageIndices[exercise._id] ? 'bg-purple-500' : 'bg-gray-400'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Image carousel controls */}
                                                        {exercise.image.length > 1 && (
                                                            <>
                                                                <button
                                                                    onClick={() => prevImage(exercise._id, exercise.image.length)}
                                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/60 p-1 rounded-full hover:bg-purple-700/60 text-white"
                                                                    aria-label="Previous image"
                                                                >
                                                                    <ChevronLeft size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => nextImage(exercise._id, exercise.image.length)}
                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/60 p-1 rounded-full hover:bg-purple-700/60 text-white"
                                                                    aria-label="Next image"
                                                                >
                                                                    <ChevronRight size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-lg flex items-center">
                                                    {exercise.category}
                                                </div>

                                                {exercise.video && (
                                                    <div className="absolute bottom-2 right-2">
                                                        <div className="bg-gray-800/60 p-2 rounded-full">
                                                            <Film size={20} className="text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6">
                                                <div className="flex mb-2">
                                                    <span className="bg-purple-900/40 text-purple-200 text-xs px-2 py-1 rounded mr-2">
                                                        {exercise.subCategory}
                                                    </span>
                                                    <span className="bg-purple-900/40 text-purple-200 text-xs px-2 py-1 rounded">
                                                        {exercise.position}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {exercise.title}
                                                </h3>

                                                <p className="text-gray-300 mb-4 line-clamp-2">
                                                    {exercise.description}
                                                </p>

                                                <div className="flex justify-between text-sm text-gray-400 pt-3 border-t border-gray-600">
                                                    <div className="flex items-center">
                                                        <Eye size={16} className="mr-1" />
                                                        <span>{exercise.views}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Heart size={16} className="mr-1" />
                                                        <span>{exercise.favorites}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation buttons */}
                            {trendingExercises.length > visibleCards && (
                                <div className="flex justify-center mt-4 space-x-4">
                                    <button
                                        onClick={prevExercises}
                                        disabled={exerciseStartIdx === 0}
                                        className={`p-2 rounded-full ${exerciseStartIdx === 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}
                                        aria-label="Previous exercises"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextExercises}
                                        disabled={exerciseStartIdx >= trendingExercises.length - visibleCards}
                                        className={`p-2 rounded-full ${exerciseStartIdx >= trendingExercises.length - visibleCards ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}
                                        aria-label="Next exercises"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default TrendingSection;