import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const TrendingSection = () => {
    const [trendingData, setTrendingData] = useState({
        trendingTherapists: [],
        trendingExercises: []
    });
    const [currentTherapistIndex, setCurrentTherapistIndex] = useState(0);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                const response = await axios.get(`${API_URL}/public/trending`);
                setTrendingData(response.data.data);
            } catch (error) {
                console.error('Error fetching trending data:', error);
            }
        };

        fetchTrendingData();
    }, []);

    // Auto-rotate carousels
    useEffect(() => {
        const therapistInterval = setInterval(() => {
            setCurrentTherapistIndex((prev) => 
                prev === trendingData.trendingTherapists.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        const exerciseInterval = setInterval(() => {
            setCurrentExerciseIndex((prev) => 
                prev === trendingData.trendingExercises.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => {
            clearInterval(therapistInterval);
            clearInterval(exerciseInterval);
        };
    }, [trendingData]);

    const nextTherapist = () => {
        setCurrentTherapistIndex((prev) => 
            prev === trendingData.trendingTherapists.length - 1 ? 0 : prev + 1
        );
    };

    const prevTherapist = () => {
        setCurrentTherapistIndex((prev) => 
            prev === 0 ? trendingData.trendingTherapists.length - 1 : prev - 1
        );
    };

    const nextExercise = () => {
        setCurrentExerciseIndex((prev) => 
            prev === trendingData.trendingExercises.length - 1 ? 0 : prev + 1
        );
    };

    const prevExercise = () => {
        setCurrentExerciseIndex((prev) => 
            prev === 0 ? trendingData.trendingExercises.length - 1 : prev - 1
        );
    };

    return (
        <div className="py-16 bg-gray-800">
            <div className="container mx-auto px-4">
                {/* Trending Therapists */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Top Therapists
                    </h2>
                    <div className="relative max-w-4xl mx-auto">
                        <div className="relative overflow-hidden rounded-lg">
                            {trendingData.trendingTherapists.map((therapist, index) => (
                                <div
                                    key={therapist._id}
                                    className={`transition-opacity duration-500 absolute w-full ${
                                        index === currentTherapistIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl">
                                        <img
                                            src={therapist.profileImage}
                                            alt={therapist.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-white mb-2">
                                                {therapist.name}
                                            </h3>
                                            <p className="text-gray-300 mb-4">
                                                {therapist.specialization}
                                            </p>
                                            <div className="flex justify-between text-sm text-gray-400">
                                                <span>Consultations: {therapist.consultationCount}</span>
                                                <span>Followers: {therapist.followers}</span>
                                                <span>Rating: {therapist.rating}/5</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={prevTherapist}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors"
                        >
                            ←
                        </button>
                        <button
                            onClick={nextTherapist}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors"
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* Trending Exercises */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Trending Exercises
                    </h2>
                    <div className="relative max-w-4xl mx-auto">
                        <div className="relative overflow-hidden rounded-lg">
                            {trendingData.trendingExercises.map((exercise, index) => (
                                <div
                                    key={exercise._id}
                                    className={`transition-opacity duration-500 absolute w-full ${
                                        index === currentExerciseIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl">
                                        <img
                                            src={exercise.thumbnail}
                                            alt={exercise.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-white mb-2">
                                                {exercise.title}
                                            </h3>
                                            <p className="text-gray-300 mb-4 line-clamp-2">
                                                {exercise.description}
                                            </p>
                                            <div className="flex justify-between text-sm text-gray-400">
                                                <span>Views: {exercise.views}</span>
                                                <span>Favorites: {exercise.favorites}</span>
                                                <span className="capitalize">Level: {exercise.difficulty}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={prevExercise}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors"
                        >
                            ←
                        </button>
                        <button
                            onClick={nextExercise}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition-colors"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendingSection; 