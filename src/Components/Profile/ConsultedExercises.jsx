import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, MapPin, Briefcase, Users, Calendar, Clock, Play, Image as ImageIcon, Star, Crown, Eye, Dumbbell } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MediaCarousel from '../MediaCarousel';

const API_URL = process.env.REACT_APP_API_URL || '';

const ConsultedExercises = () => {
	const [consultedData, setConsultedData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedConsultation, setSelectedConsultation] = useState(null);
	const [viewMode, setViewMode] = useState('therapists'); // 'therapists' or 'exercises'
	const navigate = useNavigate();

	useEffect(() => {
		fetchConsultedExercises();
	}, []);

	const fetchConsultedExercises = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/users/consultations`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth implementation
				}
			});
			setConsultedData(response.data.consultedData);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to fetch consulted exercises');
		} finally {
			setLoading(false);
		}
	};

	const handleViewExercises = (consultation) => {
		setSelectedConsultation(consultation);
		setViewMode('exercises');
	};

	const handleBackToTherapists = () => {
		setViewMode('therapists');
		setSelectedConsultation(null);
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
					<p className="text-gray-300">Loading your consultations...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md">
						<p className="text-red-300 mb-4">{error}</p>
						<button
							onClick={fetchConsultedExercises}
							className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (viewMode === 'exercises' && selectedConsultation) {
		return (
			<div className="min-h-screen bg-gray-900 text-white">
				<div className="container mx-auto px-2">
					{/* Header with back button */}
					<div className="flex flex-col md:flex-row justify-between gap-4 md:items-center items-start mb-8">
						<button
							onClick={handleBackToTherapists}
							className="flex items-center gap-2 text-sm md:text-base bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors mr-4"
						>
							<ArrowLeft size={20} />
							Back
						</button>
						<div>
							<h1 className="text-xl md:text-2xl font-bold">Recommended Exercises</h1>
							<p className="text-gray-400">By Dr. {selectedConsultation.therapist.name}</p>
						</div>
					</div>

					{/* Consultation Notes */}
					{selectedConsultation.notes && (
						<div className="bg-gray-800 rounded-xl p-4 mb-8 border border-purple-500/30">
							<h3 className="text-lg font-semibold text-purple-300">Therapist Notes</h3>
							<p className="text-gray-300 leading-relaxed">{selectedConsultation.notes}</p>
						</div>
					)}

					{/* Exercises Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{selectedConsultation.recommendedExercises.map((exercise) => (
							<div key={exercise._id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
								{/* Exercise Image/Video */}
								<div className="relative h-48 bg-gradient-to-br from-purple-900/50 to-gray-900">
									{exercise?.video && exercise.image?.length > 0 ? (
										<MediaCarousel video={exercise?.video || null} images={exercise.image || []} />
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<ImageIcon size={48} className="text-gray-600" />
										</div>
									)}
									{exercise.isPremium && (
										<div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
											<Crown size={12} />
											Premium
										</div>
									)}
									{exercise.video && (
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="bg-purple-600 hover:bg-purple-700 rounded-full p-3 cursor-pointer transition-colors">
												<Play size={24} fill="white" />
											</div>
										</div>
									)}
								</div>

								{/* Exercise Details */}
								<div className="p-6">
									<div className="flex justify-between items-start mb-3">
										<h3 className="text-lg font-semibold text-white">{exercise.title}</h3>
										<div className="flex items-center gap-1 text-gray-400 text-sm">
											<Eye size={14} />
											{exercise.views}
										</div>
									</div>

									<p className="text-gray-400 text-sm mb-4 line-clamp-2">{exercise.description}</p>

									{/* Exercise Stats */}
									<div className="grid grid-cols-3 gap-3 mb-4">
										<div className="bg-gray-700 rounded-lg p-2 text-center">
											<div className="text-purple-400 font-semibold">{exercise.reps}</div>
											<div className="text-xs text-gray-400">Reps</div>
										</div>
										<div className="bg-gray-700 rounded-lg p-2 text-center">
											<div className="text-purple-400 font-semibold">{exercise.set}</div>
											<div className="text-xs text-gray-400">Sets</div>
										</div>
										<div className="bg-gray-700 rounded-lg p-2 text-center">
											<div className="text-purple-400 font-semibold">{exercise.hold}s</div>
											<div className="text-xs text-gray-400">Hold</div>
										</div>
									</div>

									{/* Category Tags */}
									<div className="flex flex-wrap gap-2 mb-4">
										<span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded-full text-xs">
											{exercise.category}
										</span>
										<span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
											{exercise.subCategory}
										</span>
									</div>

									{/* Perform Frequency */}
									<div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
										<Clock size={14} />
										{exercise.perform.count} time(s) per {exercise.perform.type}
									</div>

									{/* Action Button */}
									<button
										onClick={() => navigate(`/exercise/${exercise._id}`)}
										className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors font-medium"
									>
										View Exercise
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="container mx-auto px-2">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Your Consultations</h1>
					<p className="text-gray-400">View your therapists and recommended exercises</p>
				</div>

				{consultedData.length === 0 ? (
					<div className="text-center py-12">
						<div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
							<User size={48} className="text-gray-600 mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">No Consultations Found</h3>
							<p className="text-gray-400">You haven't had any consultations yet.</p>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{consultedData.map((consultation) => (
							<div key={consultation.consultationId} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
								{/* Therapist Avatar */}
								<div className="flex items-center mb-6">
									<div className="relative flex-shrink-0">
										<img
											src={consultation.therapist.profilePic}
											alt={consultation.therapist.name}
											className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
										/>
										<div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-gray-800"></div>
									</div>
									<div className="ml-4">
										<h3 className="text-lg font-semibold text-white">Dr. {consultation.therapist.name}</h3>
										<div className="flex flex-wrap gap-2 mt-2">
											{consultation.therapist.specializations?.slice(0, 2).map((spec, idx) => (
												<span
													key={idx}
													className="bg-purple-900/30 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-800/40"
												>
													{spec}
												</span>
											))}
											{consultation.therapist.specializations?.length > 2 && (
												<span className="bg-purple-900/30 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-800/40">
													+{consultation.therapist.specializations.length - 2}
												</span>
											)}
										</div>
									</div>
								</div>

								{/* Therapist Info */}
								<div className="space-y-2 mb-6">
									<div className="flex items-center gap-2 text-gray-300">
										<Briefcase size={16} className="text-purple-400" />
										<span className="text-sm">{consultation.therapist.workingAt}</span>
									</div>
									<div className="flex items-center gap-2 text-gray-300">
										<MapPin size={16} className="text-purple-400" />
										<span className="text-sm">{consultation.therapist.address}</span>
									</div>
									<div className="flex items-center gap-2 text-gray-300">
										<Users size={16} className="text-purple-400" />
										<span className="text-sm">{consultation.therapist.followers} followers</span>
									</div>
								</div>

								{/* Consultation Date */}
								<div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
									<Calendar size={14} />
									Consulted on <span className='text-white'>{formatDate(consultation.consultationDate)}</span>
								</div>

								{/* Exercise Count */}
								<div className="flex items-center gap-2 text-purple-400 text-sm mb-6">
									<Dumbbell size={14} />
									Recommended: <span className='text-white'>{consultation.recommendedExercises.length} Exercises</span>
								</div>

								{/* Action Button */}
								<button
									onClick={() => handleViewExercises(consultation)}
									className="w-full text-sm bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
								>
									<Eye size={18} />
									View Exercises
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ConsultedExercises;