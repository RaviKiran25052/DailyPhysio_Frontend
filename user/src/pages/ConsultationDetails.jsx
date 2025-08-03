import React, { useState, useEffect } from 'react';
import { User, Calendar, Play, Eye, Heart, Award, Crown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import MediaCarousel from '../components/Exercises/MediaCarousel';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500/dailyphysio';

const ConsultationDetails = () => {
	const [consultation, setConsultation] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Extract consultation ID from URL (simulated)
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		fetchConsultationDetails();
	}, [id]);

	const fetchConsultationDetails = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/consultation/${id}`);

			if (response.data.success) {
				setConsultation(response.data.data);
			}
		} catch (err) {
			setError('Failed to load consultation details');
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const getDaysUntilExpiry = (expiryDate) => {
		const now = new Date();
		const expiry = new Date(expiryDate);
		const diffTime = expiry - now;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
				<div className="max-w-6xl mx-auto">
					{/* Header Skeleton */}
					<div className="bg-primary-50 rounded-lg p-6 mb-8 animate-pulse">
						<div className="h-8 bg-primary-200 rounded w-1/3 mb-4"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="space-y-3">
								<div className="h-4 bg-primary-200 rounded w-3/4"></div>
								<div className="h-4 bg-primary-200 rounded w-1/2"></div>
							</div>
							<div className="space-y-3">
								<div className="h-4 bg-primary-200 rounded w-2/3"></div>
								<div className="h-4 bg-primary-200 rounded w-3/4"></div>
							</div>
							<div className="space-y-3">
								<div className="h-4 bg-primary-200 rounded w-1/2"></div>
								<div className="h-4 bg-primary-200 rounded w-2/3"></div>
							</div>
						</div>
					</div>

					{/* Exercise Cards Skeleton */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<div key={i} className="bg-white border border-primary-100 rounded-lg overflow-hidden animate-pulse">
								<div className="h-48 bg-primary-200"></div>
								<div className="p-6 space-y-4">
									<div className="h-6 bg-primary-200 rounded w-3/4"></div>
									<div className="space-y-2">
										<div className="h-4 bg-primary-100 rounded"></div>
										<div className="h-4 bg-primary-100 rounded w-5/6"></div>
									</div>
									<div className="flex justify-between">
										<div className="h-4 bg-primary-100 rounded w-1/4"></div>
										<div className="h-4 bg-primary-100 rounded w-1/4"></div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center p-4">
				<div className="text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Consultation</h3>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={fetchConsultationDetails}
						className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (!consultation || !consultation.recommendedExercises || consultation.recommendedExercises.length === 0) {
		return (
			<div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<h3 className="text-2xl font-semibold text-gray-900 mb-3">No Exercises Found</h3>
						<p className="text-gray-600 max-w-md mx-auto">
							This consultation doesn't have any recommended exercises yet. Check back later or contact your therapist.
						</p>
					</div>
				</div>
			</div>
		);
	}

	const daysUntilExpiry = getDaysUntilExpiry(consultation.request.expiresOn);

	return (
		<div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
			<div className="max-w-6xl mx-auto">
				{/* Consultation Header */}
				<div className="bg-primary-50 rounded-lg p-6 mb-8 border border-primary-100">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
						<h1 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-4 lg:mb-0">
							Consultation Details
						</h1>
						<div className="flex items-center space-x-4">
							<span className={`px-3 py-1 rounded-full text-sm font-medium ${consultation.request.status === 'active'
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
								}`}>
								{consultation.request.status.charAt(0).toUpperCase() + consultation.request.status.slice(1)}
							</span>
							{daysUntilExpiry > 0 && (
								<span className="text-sm text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
									{daysUntilExpiry} days remaining
								</span>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Therapist Info */}
						<div className="space-y-3">
							<h3 className="font-semibold text-primary-700 flex items-center">
								<User className="w-5 h-5 mr-2" />
								Therapist
							</h3>
							<div className="flex items-center space-x-3">
								<img
									src={consultation.therapist_id.profilePic}
									alt={consultation.therapist_id.name}
									className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
								/>
								<div>
									<p className="font-medium text-gray-900">{consultation.therapist_id.name}</p>
									<p className="text-sm text-gray-600">{consultation.therapist_id.workingAt}</p>
									<p className="text-xs text-primary-600">{consultation.therapist_id.experience} experience</p>
								</div>
							</div>
							<div className="flex flex-wrap gap-1">
								{consultation.therapist_id.specializations.slice(0, 2).map((spec, index) => (
									<span key={index} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
										{spec}
									</span>
								))}
							</div>
						</div>

						{/* Patient Info */}
						<div className="space-y-3">
							<h3 className="font-semibold text-primary-700 flex items-center">
								<User className="w-5 h-5 mr-2" />
								Patient
							</h3>
							<p className="font-medium text-gray-900">{consultation.patient_id.name}</p>
							<p className="text-sm text-gray-600">{consultation.patient_id.email}</p>
						</div>

						{/* Consultation Dates */}
						<div className="space-y-3">
							<h3 className="font-semibold text-primary-700 flex items-center">
								<Calendar className="w-5 h-5 mr-2" />
								Timeline
							</h3>
							<div className="space-y-2">
								<p className="text-sm">
									<span className="text-gray-600">Created:</span>
									<span className="ml-2 font-medium">{formatDate(consultation.createdAt)}</span>
								</p>
								<p className="text-sm">
									<span className="text-gray-600">Expires:</span>
									<span className="ml-2 font-medium">{formatDate(consultation.request.expiresOn)}</span>
								</p>
							</div>
						</div>
					</div>

					{/* Notes */}
					{consultation.notes && (
						<div className="mt-6 p-4 bg-white rounded-lg border border-primary-200">
							<h3 className="font-semibold text-primary-700 mb-2">Therapist Notes</h3>
							<p className="text-gray-700">{consultation.notes}</p>
						</div>
					)}
				</div>

				{/* Exercise Cards */}
				<div className="mb-6">
					<h2 className="text-xl sm:text-2xl font-bold text-primary-800 mb-6">
						Recommended Exercises ({consultation.recommendedExercises.length})
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{consultation.recommendedExercises.map((exercise) => (
							<div key={exercise._id} className="bg-white border border-primary-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
								{/* Exercise Image */}
								<div className="relative h-48 bg-primary-50">
									<MediaCarousel
										images={exercise.image}
										video={exercise.video}
									/>
									<div className="absolute top-3 left-3 flex space-x-2">
										{exercise.isPremium && (
											<span className="bg-yellow-400 text-yellow-800 p-1 rounded text-xs font-medium flex items-center">
												<Crown className="w-5 h-5" />
											</span>
										)}
									</div>
								</div>

								{/* Exercise Details */}
								<div className="p-6 relative">
									<div className="mb-3">
										<h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.title}</h3>
										<p className="text-sm text-gray-600 line-clamp-2">{exercise.description}</p>
									</div>
									<div className="absolute top-3 right-3 flex space-x-2 text-white text-xs">
										<span className="bg-black bg-opacity-50 px-2 py-1 rounded flex items-center">
											<Eye className="w-3 h-3 mr-1" />
											{exercise.views}
										</span>
										<span className="bg-black bg-opacity-50 px-2 py-1 rounded flex items-center">
											<Heart className="w-3 h-3 mr-1" />
											{exercise.favorites}
										</span>
									</div>

									{/* Exercise Stats */}
									<div className="grid grid-cols-2 gap-4 mb-4 text-sm">
										<div>
											<span className="text-gray-500">Reps:</span>
											<span className="ml-1 font-semibold text-primary-600">{exercise.reps}</span>
										</div>
										<div>
											<span className="text-gray-500">Sets:</span>
											<span className="ml-1 font-semibold text-primary-600">{exercise.set}</span>
										</div>
										<div>
											<span className="text-gray-500">Hold:</span>
											<span className="ml-1 font-semibold text-primary-600">{exercise.hold}s</span>
										</div>
										<div>
											<span className="text-gray-500">Frequency:</span>
											<span className="ml-1 font-semibold text-primary-600">
												{exercise.perform.count}x/{exercise.perform.type}
											</span>
										</div>
									</div>

									{/* Exercise Categories */}
									<div className="flex flex-wrap gap-2 mb-4">
										<span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
											{exercise.category}
										</span>
										<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
											{exercise.position}
										</span>
									</div>

									{/* Action Button */}
									<button
										onClick={() => navigate(`/consultation/exercise/${exercise._id}`)}
										className="w-full cursor-pointer bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors font-medium"
									>
										View Exercise
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConsultationDetails;