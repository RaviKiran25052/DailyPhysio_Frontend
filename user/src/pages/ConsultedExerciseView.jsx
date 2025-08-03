import React, { useState, useEffect } from 'react';
import {
	Eye,
	Heart,
	Clock,
	Repeat,
	Users,
	ArrowLeft,
	Info,
	Calendar,
	Share2,
	Target,
	Crown
} from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import MediaCarousel from '../components/Exercises/MediaCarousel';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/dailyphysio';

const ConsultedExerciseView = () => {
	const [exercise, setExercise] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Extract exercise ID from URL
	const { id } = useParams();

	useEffect(() => {
		fetchExerciseDetails();
	}, [id]);

	const fetchExerciseDetails = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/consultation/exercise/${id}`);

			if (response.data.success) {
				setExercise(response.data.data);
			}
		} catch (err) {
			setError('Failed to load exercise details');
		} finally {
			setLoading(false);
		}
	};

	const shareExercise = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: exercise.title,
					text: exercise.description,
					url: window.location.href,
				});
			} catch (err) {
				console.log('Error sharing:', err);
			}
		} else {
			navigator.clipboard.writeText(window.location.href);
			// You can add a toast notification here
		}
	};

	const goBack = () => {
		window.history.back();
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
				{/* Header Skeleton */}
				<div className="bg-white/80 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-10">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
						<div className="flex items-center animate-pulse">
							<div className="w-8 h-8 bg-primary-200 rounded mr-4"></div>
							<div className="h-6 bg-primary-200 rounded w-24"></div>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
					<div className="lg:grid lg:grid-cols-12 lg:gap-8">
						{/* Left Column Skeleton */}
						<div className="lg:col-span-7 mb-8 lg:mb-0">
							<div className="bg-primary-100 rounded-2xl h-96 mb-6 animate-pulse"></div>
							<div className="space-y-4 animate-pulse">
								<div className="h-8 bg-primary-200 rounded w-3/4"></div>
								<div className="h-4 bg-primary-100 rounded w-full"></div>
								<div className="h-4 bg-primary-100 rounded w-5/6"></div>
							</div>
						</div>

						{/* Right Column Skeleton */}
						<div className="lg:col-span-5">
							<div className="space-y-6 animate-pulse">
								<div className="grid grid-cols-2 gap-4">
									{[1, 2, 3, 4].map(i => (
										<div key={i} className="h-24 bg-primary-100 rounded-xl"></div>
									))}
								</div>
								<div className="h-32 bg-primary-100 rounded-xl"></div>
								<div className="h-40 bg-primary-100 rounded-xl"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
				<div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Exercise</h3>
					<p className="text-gray-600 mb-6">{error}</p>
					<button
						onClick={fetchExerciseDetails}
						className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (!exercise) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
				<div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
					<div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
					</div>
					<h3 className="text-2xl font-semibold text-gray-900 mb-3">Exercise Not Found</h3>
					<p className="text-gray-600 max-w-md mx-auto">
						The exercise you're looking for doesn't exist or is no longer available.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
			{/* Enhanced Header */}
			<div className="bg-white/80 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<button
						onClick={goBack}
						className="flex items-center text-primary-600 hover:text-primary-700 transition-colors group"
					>
						<ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
						<span className="font-medium">Back</span>
					</button>
				</div>
			</div>

			<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
				{/* 2-Column Layout */}
				<div className="lg:grid lg:grid-cols-12 lg:gap-8">
					{/* Left Column - Media & Description */}
					<div className="lg:col-span-7 mb-8 lg:mb-0">
						{/* Media Section with Enhanced Styling */}
						<div className="relative overflow-hidden rounded-2xl shadow-xl bg-white h-52 md:h-96 mb-8">
							<MediaCarousel images={exercise.image} video={exercise.video} />
							{exercise.isPremium && (
								<span className="absolute top-3 left-3 bg-yellow-400 text-yellow-800 p-1 rounded text-sm flex items-center z-10">
									<Crown className="w-5 h-5 mr-2" /> Premium
								</span>
							)}
						</div>

						{/* Exercise Title & Basic Info */}
						<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<h1 className="text-xl md:text-2xl mb-4 font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
										{exercise.title}
									</h1>

									<div className="grid grid-cols-1 md:grid-cols-2 content-start gap-6">
										<div>
											{/* Enhanced Categories */}
											<div className="flex flex-wrap items-center gap-2 mb-4">
												<span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
													{exercise.category}
												</span>
												/
												<span className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-1 rounded-full text-sm font-medium">
													{exercise.subCategory}
												</span>
											</div>
											<div className='flex items-center gap-2'>
												position:
												<span className="bg-gradient-to-r from-primary-400 to-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
													{exercise.position}
												</span>
											</div>
										</div>

										<div className="flex items-start justify-end space-x-4 text-sm text-gray-600">
											<span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
												<Eye className="w-4 h-4 mr-1" />
												{exercise.views}
											</span>
											<span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
												<Heart className="w-4 h-4 mr-1" />
												{exercise.favorites}
											</span>
											<button
												onClick={shareExercise}
												className="p-2 flex items-center gap-2 text-primary-600 hover:bg-primary-100 rounded-xl transition-all duration-200 hover:scale-110"
											>
												<Share2 className="w-4 h-4" /> Share
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
							<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
								<div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
									<Info className="w-4 h-4 text-white" />
								</div>
								About This Exercise
							</h2>
							<p className="text-gray-700 leading-relaxed">{exercise.description}</p>
						</div>
					</div>

					{/* Right Column - Stats & Additional Info */}
					<div className="lg:col-span-5">
						{/* Enhanced Exercise Stats Grid */}
						<div className="grid grid-cols-2 gap-4 mb-6">
							<div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 md:p-6 rounded-2xl text-center text-white shadow-xl transform hover:scale-105 transition-all duration-200">
								<div className="flex items-center gap-4">
									<div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<Repeat className="w-5 h-5" />
									</div>
									<div className='flex flex-col items-start'>
										<div className="md:text-xl font-bold mb-1">{exercise.reps}</div>
										<div className="text-xs md:text-sm opacity-90">Repetitions</div>
									</div>
								</div>
							</div>

							<div className="bg-gradient-to-br from-primary-600 to-primary-700 p-4 md:p-6 rounded-2xl text-center text-white shadow-xl transform hover:scale-105 transition-all duration-200">
								<div className="flex items-center gap-4">
									<div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<Clock className="w-5 h-5" />
									</div>
									<div className='flex flex-col items-start'>
										<div className="md:text-xl font-bold mb-1">{exercise.hold}s</div>
										<div className="text-xs md:text-sm opacity-90">Hold Time</div>
									</div>
								</div>
							</div>

							<div className="bg-gradient-to-br from-primary-400 to-primary-500 p-4 md:p-6 rounded-2xl text-center text-white shadow-xl transform hover:scale-105 transition-all duration-200">
								<div className="flex items-center gap-4">
									<div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<Users className="w-5 h-5" />
									</div>
									<div className='flex flex-col items-start'>
										<div className="md:text-xl font-bold mb-1">{exercise.set}</div>
										<div className="text-xs md:text-sm opacity-90">Sets</div>
									</div>
								</div>
							</div>

							<div className="bg-gradient-to-br from-primary-700 to-primary-800 p-4 md:p-6 rounded-2xl text-center text-white shadow-xl transform hover:scale-105 transition-all duration-200">
								<div className="flex items-center gap-4">
									<div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<Calendar className="w-5 h-5" />
									</div>
									<div className='flex flex-col items-start'>
										<div className="md:text-xl font-bold mb-1">
											{exercise.perform.count}x/{exercise.perform.type}
										</div>
										<div className="text-xs md:text-sm opacity-90">Frequency</div>
									</div>
								</div>
							</div>
						</div>

						{/* Instructions */}
						<div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl shadow-lg p-6 border border-primary-200">
							<h2 className="text-xl font-bold text-primary-800 mb-4 flex items-center">
								<div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mr-3">
									<Target className="w-4 h-4 text-white" />
								</div>
								How to Perform
							</h2>
							<p className="text-primary-700 leading-relaxed">{exercise.instruction}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConsultedExerciseView;