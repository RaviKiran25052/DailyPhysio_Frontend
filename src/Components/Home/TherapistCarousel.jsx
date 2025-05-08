import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, Clock, Users, MapPin, Dumbbell, Star, Heart, Calendar } from 'lucide-react';
import { FaUserMd } from 'react-icons/fa';

const TherapistCarousel = ({ therapists = [], loading = false }) => {
	// State for carousel positioning
	const [startIdx, setStartIdx] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [hoveredCard, setHoveredCard] = useState(null);
	const carouselRef = useRef(null);
	const cardRefs = useRef([]);

	// Determine visible cards count based on screen width
	const [visibleCards, setVisibleCards] = useState(3);
	const [cardWidth, setCardWidth] = useState(0);

	useEffect(() => {
		// Handle responsive card display
		const handleResize = () => {
			if (window.innerWidth >= 1280) { // xl
				setVisibleCards(3);
			} else if (window.innerWidth >= 768) { // md
				setVisibleCards(2);
			} else { // mobile
				setVisibleCards(1);
			}

			// Update card width calculation
			if (carouselRef.current) {
				const containerWidth = carouselRef.current.offsetWidth;
				const gap = 16; // gap between cards in pixels
				const calculatedWidth = (containerWidth - (gap * (visibleCards - 1))) / visibleCards;
				setCardWidth(calculatedWidth);
			}
		};

		// Initial check
		handleResize();

		// Add resize listener
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [visibleCards]);

	// Navigation functions with smooth animation
	const nextTherapists = () => {
		if (isAnimating || startIdx >= displayTherapists.length - visibleCards) return;
		setIsAnimating(true);
		setStartIdx(prev => Math.min(prev + 1, Math.max(0, displayTherapists.length - visibleCards)));
		setTimeout(() => setIsAnimating(false), 500); // match transition duration
	};

	const prevTherapists = () => {
		if (isAnimating || startIdx === 0) return;
		setIsAnimating(true);
		setStartIdx(prev => Math.max(0, prev - 1));
		setTimeout(() => setIsAnimating(false), 500); // match transition duration
	};

	const goToSlide = (index) => {
		if (isAnimating) return;
		setIsAnimating(true);
		setStartIdx(index);
		setTimeout(() => setIsAnimating(false), 500); // match transition duration
	};

	// Helper component for loading skeleton
	const SkeletonCard = () => (
		<div className="bg-gray-800/60 rounded-xl overflow-hidden shadow-xl animate-pulse w-full backdrop-blur-sm border border-gray-700/50">
			<div className="w-full h-48 bg-gray-700/70"></div>
			<div className="p-6">
				<div className="flex items-center mb-4">
					<div className="w-16 h-16 rounded-full bg-gray-700/70 mr-4"></div>
					<div className="flex-1">
						<div className="h-6 bg-gray-700/70 rounded mb-2"></div>
						<div className="h-4 bg-gray-700/70 rounded"></div>
					</div>
				</div>
				<div className="h-4 bg-gray-700/70 rounded mb-4"></div>
				<div className="flex justify-between">
					<div className="h-3 w-20 bg-gray-700/70 rounded"></div>
					<div className="h-3 w-20 bg-gray-700/70 rounded"></div>
				</div>
			</div>
		</div>
	);

	// Generate loading skeletons
	const renderSkeletons = (count) => {
		return Array(count).fill(0).map((_, index) => (
			<div key={`skeleton-${index}`} className="px-2 flex-shrink-0" style={{ width: cardWidth ? cardWidth + 'px' : '100%' }}>
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
			followers: 156,
			rating: 4.8,
			availability: 'Next available: Today'
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
			followers: 231,
			rating: 4.9,
			availability: 'Next available: Tomorrow'
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
			followers: 93,
			rating: 4.7,
			availability: 'Next available: Friday'
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
			followers: 310,
			rating: 4.9,
			availability: 'Next available: Monday'
		},
		{
			_id: '5',
			name: 'Dr. Olivia Martinez',
			profileImage: '/api/placeholder/100/100',
			specializations: ['Bipolar Disorder', 'Youth Counseling', 'Stress Management'],
			workingAt: 'Balanced Mind Center',
			address: 'Miami, FL',
			experience: '9 years',
			consultationCount: 410,
			followers: 175,
			rating: 4.6,
			availability: 'Next available: Thursday'
		}
	];

	// Use sample data if no therapists are provided
	const displayTherapists = therapists.length > 0 ? therapists : sampleTherapists;

	// Set up card refs
	useEffect(() => {
		cardRefs.current = cardRefs.current.slice(0, displayTherapists.length);
	}, [displayTherapists]);

	return (
		<div className="relative z-10 mx-4 md:mx-20 overflow-hidden mb-10">
			<div className="flex items-center justify-between mb-10">
				<h2 className="text-3xl sm:text-4xl font-bold text-white text-center relative">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-gray-500">
						Top Therapists
					</span>
					<div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-gray-500 mt-2"></div>
				</h2>

				{!loading && displayTherapists.length > visibleCards && (
					<div className="hidden sm:flex items-center space-x-3">
						<button
							onClick={prevTherapists}
							disabled={startIdx === 0 || isAnimating}
							className={`flex items-center justify-center w-10 h-10 rounded-full ${startIdx === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
								'bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 hover:text-white'
								} transition-all duration-300`}
							aria-label="Previous therapists"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							onClick={nextTherapists}
							disabled={startIdx >= displayTherapists.length - visibleCards || isAnimating}
							className={`flex items-center justify-center w-10 h-10 rounded-full ${startIdx >= displayTherapists.length - visibleCards ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
								'bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 hover:text-white'
								} transition-all duration-300`}
							aria-label="Next therapists"
						>
							<ChevronRight size={20} />
						</button>
					</div>
				)}
			</div>

			{loading ? (
				<div className="flex space-x-4 overflow-hidden" ref={carouselRef}>
					{renderSkeletons(visibleCards)}
				</div>
			) : (
				<div className="relative">
					<div
						ref={carouselRef}
						className="flex space-x-4"
						style={{
							transform: `translateX(-${startIdx * (cardWidth + 16)}px)`,
							transition: 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
						}}
					>
						{displayTherapists.map((therapist, index) => (
							<div
								key={therapist._id}
								ref={el => cardRefs.current[index] = el}
								className="flex-shrink-0"
								style={{ width: cardWidth ? cardWidth + 'px' : '100%' }}
								onMouseEnter={() => setHoveredCard(index)}
								onMouseLeave={() => setHoveredCard(null)}
							>
								<div className={`bg-gray-800/80 rounded-xl overflow-hidden shadow-xl border border-gray-700/60 h-full relative group backdrop-blur-sm transition-all duration-500 
                    ${hoveredCard === index ? 'shadow-purple-500/30 border-purple-500/40' : 'hover:shadow-purple-500/20'}`}
								>

									{/* Purple radial gradient on hover */}
									<div className={`absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                      ${hoveredCard === index ? 'opacity-100' : ''}`}></div>

									<div className="p-6 flex flex-col h-full justify-between">
										{/* Profile picture and name section */}
										<div className="flex items-center mb-5">
											<div
												className={`w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 ${hoveredCard === index
													? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-gray-800'
													: ''
													} transition-all duration-300`}
											>
												{therapist.profileImage ? (
													<img
														src={therapist.profileImage}
														alt={therapist.name}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full bg-gradient-to-br from-purple-700 to-purple-900 p-4 flex items-center justify-center">
														<FaUserMd className="text-white text-3xl" />
													</div>
												)}
											</div>
											<div>
												<h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
													{therapist.name}
												</h3>
												<div className="flex flex-wrap gap-2 mt-2">
													{therapist.specializations?.slice(0, 2).map((spec, idx) => (
														<span
															key={idx}
															className="bg-purple-900/30 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-800/40"
														>
															{spec}
														</span>
													))}
													{therapist.specializations?.length > 2 && (
														<span className="bg-purple-900/30 text-purple-200 text-xs px-2 py-0.5 rounded-full border border-purple-800/40">
															+{therapist.specializations.length - 2}
														</span>
													)}
												</div>
											</div>
										</div>

										{/* Separator line */}
										<div className="w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mb-4 rounded-full"></div>

										{/* Info section - grows to fill space */}
										<div className="flex-1 space-y-3 text-sm text-gray-300 mb-4 pl-1">
											<div className="flex items-center group-hover:text-purple-200 transition-colors duration-300">
												<Briefcase size={16} className="mr-2 text-purple-400" />
												<span>{therapist.workingAt}</span>
											</div>
											<div className="flex items-center group-hover:text-purple-200 transition-colors duration-300">
												<MapPin size={16} className="mr-2 text-purple-400" />
												<p>{therapist.address || 'Address not available'}</p>
											</div>
										</div>

										{/* Stats card */}
										<div className="bg-gray-900/60 rounded-xl p-4 grid grid-cols-3 gap-1 border border-gray-700/40 group-hover:border-purple-500/20 transition-all duration-300 mb-4">
											<div className="flex flex-col items-center text-center">
												<Clock size={18} className="text-purple-400 mb-1" />
												<span className="text-white font-medium">{therapist.experience}</span>
												<span className="text-xs text-gray-400">Experience</span>
											</div>

											<div className="flex flex-col items-center text-center border-x border-gray-700/30">
												<Briefcase size={18} className="text-purple-400 mb-1" />
												<span className="text-white font-medium">
													{therapist.consultationCount}
												</span>
												<span className="text-xs text-gray-400">Sessions</span>
											</div>

											<div className="flex flex-col items-center text-center">
												<Users size={18} className="text-purple-400 mb-1" />
												<span className="text-white font-medium">{therapist.followers}</span>
												<span className="text-xs text-gray-400">Followers</span>
											</div>
										</div>

										{/* Button pinned at bottom */}
										<button className="flex justify-center items-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-1.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
											<Dumbbell size={14} className="mr-1.5" />
											View Exercises
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Mobile navigation buttons (visible on smaller screens) */}
					{displayTherapists.length > visibleCards && (
						<div className="sm:hidden flex justify-center mt-6 space-x-4">
							<button
								onClick={prevTherapists}
								disabled={startIdx === 0 || isAnimating}
								className={`flex items-center justify-center w-10 h-10 rounded-full ${startIdx === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
									'bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 hover:text-white'
									} transition-all duration-300`}
								aria-label="Previous therapists"
							>
								<ChevronLeft size={20} />
							</button>
							<button
								onClick={nextTherapists}
								disabled={startIdx >= displayTherapists.length - visibleCards || isAnimating}
								className={`flex items-center justify-center w-10 h-10 rounded-full ${startIdx >= displayTherapists.length - visibleCards ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
									'bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 hover:text-white'
									} transition-all duration-300`}
								aria-label="Next therapists"
							>
								<ChevronRight size={20} />
							</button>
						</div>
					)}

					{/* Pagination dots */}
					{displayTherapists.length > visibleCards && (
						<div className="flex justify-center mt-6 space-x-2">
							{Array(Math.ceil((displayTherapists.length - visibleCards + 1) / 1)).fill(0).map((_, i) => (
								<button
									key={i}
									onClick={() => goToSlide(i)}
									className={`w-2 h-2 rounded-full transition-all duration-300 ${i === Math.floor(startIdx / 1) ?
										'bg-gradient-to-r from-purple-500 to-pink-500 w-6' :
										'bg-gray-600 hover:bg-purple-400'
										}`}
									aria-label={`Go to slide ${i + 1}`}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TherapistCarousel;