import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, Clock, Users, MapPin, Dumbbell, Award } from 'lucide-react';

const TherapistCarousel = ({ therapists = [], loading = false }) => {
	// State for carousel positioning
	const [startIdx, setStartIdx] = useState(0);

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

	// Navigation functions
	const nextTherapists = () => {
		setStartIdx(prev => Math.min(prev + 1, Math.max(0, therapists.length - visibleCards)));
	};

	const prevTherapists = () => {
		setStartIdx(prev => Math.max(0, prev - 1));
	};

	// Helper component for loading skeleton
	const SkeletonCard = () => (
		<div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl animate-pulse w-full">
			<div className="w-full h-48 bg-gray-600"></div>
			<div className="p-6">
				<div className="flex items-center mb-4">
					<div className="w-16 h-16 rounded-full bg-gray-600 mr-4"></div>
					<div className="flex-1">
						<div className="h-6 bg-gray-600 rounded mb-2"></div>
						<div className="h-4 bg-gray-600 rounded"></div>
					</div>
				</div>
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
			<div key={`skeleton-${index}`} className="px-3 w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
				<SkeletonCard />
			</div>
		));
	};

	// Sample therapist data for preview
	const sampleTherapists = [
		{
			_id: '1',
			name: 'Dr. Sarah Johnson',
			profileImage: '/api/placeholder/100/100',
			specializations: ['Anxiety', 'Depression', 'Trauma'],
			workingAt: 'Mindful Wellness Center',
			address: 'San Francisco, CA',
			experience: '8 years',
			consultationCount: 320,
			followers: 156
		},
		{
			_id: '2',
			name: 'Dr. Michael Chen',
			profileImage: '/api/placeholder/100/100',
			specializations: ['Couples Therapy', 'CBT', 'Mindfulness'],
			workingAt: 'Harmony Therapy Group',
			address: 'New York, NY',
			experience: '12 years',
			consultationCount: 547,
			followers: 231
		},
		{
			_id: '3',
			name: 'Dr. Emily Roberts',
			profileImage: '/api/placeholder/100/100',
			specializations: ['PTSD', 'Grief', 'Life Transitions'],
			workingAt: 'Serenity Health Partners',
			address: 'Chicago, IL',
			experience: '6 years',
			consultationCount: 182,
			followers: 93
		},
		{
			_id: '4',
			name: 'Dr. James Wilson',
			profileImage: '/api/placeholder/100/100',
			specializations: ['Addiction', 'Family Therapy', 'Depression'],
			workingAt: 'Recovery Path Institute',
			address: 'Austin, TX',
			experience: '15 years',
			consultationCount: 723,
			followers: 310
		}
	];

	// Use sample data if no therapists are provided
	const displayTherapists = therapists.length > 0 ? therapists : sampleTherapists;

	return (
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
						{displayTherapists.slice(startIdx, startIdx + visibleCards).map((therapist, index) => (
							<div key={therapist._id} className="px-3 w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
								<div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 h-full relative group">
									

									<div className="p-6 flex flex-col">
										{/* Profile picture and name section */}
										<div className="flex items-center mb-3">
											<div className="w-16 h-16 rounded-full border-2 border-purple-500 overflow-hidden mr-3 flex-shrink-0">
												<img
													src={therapist.profileImage || '/api/placeholder/100/100'}
													alt={therapist.name}
													className="w-full h-full object-cover"
												/>
											</div>
											<div>
												<h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
													{therapist.name}
												</h3>
												<div className="flex flex-wrap gap-2 mt-1">
													{therapist.specializations?.slice(0, 2).map((spec, index) => (
														<span key={index} className="bg-purple-900/40 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-800/50">
															{spec}
														</span>
													))}
													{therapist.specializations?.length > 2 && (
														<span className="bg-purple-900/40 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-800/50">
															+{therapist.specializations.length - 2}
														</span>
													)}
												</div>
											</div>
										</div>

										<div className="space-y-3 text-sm text-gray-300 mb-4">
											<div className="flex items-center">
												<Briefcase size={16} className="mr-2 text-purple-400" />
												<span>{therapist.workingAt}</span>
											</div>
											<div className="flex items-center">
												<MapPin size={16} className="mr-2 text-purple-400" />
												<span>{therapist.address || "Address not available"}</span>
											</div>
										</div>

										{/* Stats card - experience, sessions, followers */}
										<div className="bg-gray-800 rounded-lg p-3 mb-4 grid grid-cols-3 gap-2 border border-gray-600/50 hover:border-purple-500/30 transition-all">
											<div className="flex flex-col items-center text-center">
												<Clock size={18} className="text-purple-400 mb-1" />
												<span className="text-white font-medium">{therapist.experience}</span>
												<span className="text-xs text-gray-400">Experience</span>
											</div>

											<div className="flex flex-col items-center text-center border-x border-gray-600/50">
												<Briefcase size={18} className="text-purple-400 mb-1" />
												<span className="text-white font-medium">{therapist.consultationCount}</span>
												<span className="text-xs text-gray-400">Sessions</span>
											</div>

											<div className="flex flex-col items-center text-center">
												<Users size={18} className="text-purple-400 mb-1" />
												<span className="text-white font-medium">{therapist.followers}</span>
												<span className="text-xs text-gray-400">Followers</span>
											</div>
										</div>

										<button className="self-end flex items-center text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition-colors">
											<Dumbbell size={14} className="mr-1" />
											View Exercises
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Navigation buttons */}
					{displayTherapists.length > visibleCards && (
						<>
							<button
								onClick={prevTherapists}
								disabled={startIdx === 0}
								className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 p-3 rounded-full shadow-lg ${startIdx === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors z-10`}
								aria-label="Previous therapists"
							>
								<ChevronLeft size={24} />
							</button>

							<button
								onClick={nextTherapists}
								disabled={startIdx >= displayTherapists.length - visibleCards}
								className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 p-3 rounded-full shadow-lg ${startIdx >= displayTherapists.length - visibleCards ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors z-10`}
								aria-label="Next therapists"
							>
								<ChevronRight size={24} />
							</button>
						</>
					)}

					{/* Pagination dots */}
					{displayTherapists.length > visibleCards && (
						<div className="flex justify-center mt-6 space-x-2">
							{Array(Math.max(1, displayTherapists.length - visibleCards + 1)).fill(0).map((_, i) => (
								<button
									key={i}
									onClick={() => setStartIdx(i)}
									className={`w-3 h-3 rounded-full transition-colors ${i === startIdx ? 'bg-purple-500' : 'bg-gray-600 hover:bg-purple-400'}`}
									aria-label={`Go to slide ${i + 1}`}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</section>
	);
};

export default TherapistCarousel;