import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, Heart, Calendar, Clock, Layers, Repeat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MediaCarousel from '../Exercises/MediaCarousel';

const ExerciseCarousel = ({ exercises = [], loading = false }) => {
	const navigate = useNavigate();
	// State for carousel positioning
	const [startIdx, setStartIdx] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [hoveredCard, setHoveredCard] = useState(null);

	// State for image carousels within cards
	const [cardImageIndices, setCardImageIndices] = useState({});
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

	useEffect(() => {
		// Initialize image carousel indices for each card
		if (exercises.length > 0) {
			const imageIndices = {};
			exercises.forEach(exercise => {
				imageIndices[exercise._id] = 0;
			});
			setCardImageIndices(imageIndices);
		}

		// Set up card refs
		cardRefs.current = cardRefs.current.slice(0, exercises.length);
	}, [exercises]);

	// Navigation functions for main carousel with smooth animation
	const nextExercises = () => {
		if (isAnimating || startIdx >= exercises.length - visibleCards) return;
		setIsAnimating(true);
		setStartIdx(prev => Math.min(prev + 1, Math.max(0, exercises.length - visibleCards)));
		setTimeout(() => setIsAnimating(false), 500); // match transition duration
	};

	const prevExercises = () => {
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
		<div className="bg-gray-800/60 rounded-xl overflow-hidden shadow-xl animate-pulse w-full backdrop-blur-sm border border-gray-700/50">
			<div className="w-full h-64 bg-gray-700/70"></div>
			<div className="p-6">
				<div className="h-6 bg-gray-700/70 rounded mb-2"></div>
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

	return (
		<div className="relative z-10 mx-6 md:mx-20 overflow-hidden my-10">
			<div className="flex items-center justify-between mb-10">
				<h2 className="text-3xl sm:text-4xl font-bold text-white text-center relative">
					<span className="bg-clip-text text-primary-600">
						Trending Exercises
					</span>
					<div className="h-1 w-24 bg-primary-600 mt-2"></div>
				</h2>

				{!loading && exercises.length > visibleCards && (
					<div className="hidden sm:flex items-center space-x-3">
						<button
							onClick={prevExercises}
							disabled={startIdx === 0 || isAnimating}
							className={`flex items-center justify-center w-10 h-10 rounded-full ${startIdx === 0 ? 'bg-primary-100 text-primary-300 cursor-not-allowed' :
								'bg-primary-200 text-gray-500 hover:bg-primary-400 hover:text-white'
								} transition-all duration-300`}
							aria-label="Previous exercises"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							onClick={nextExercises}
							disabled={startIdx >= exercises.length - visibleCards || isAnimating}
							className={`flex items-center justify-center w-10 h-10 rounded-full ${startIdx >= exercises.length - visibleCards ? 'bg-primary-100 text-primary-300 cursor-not-allowed' :
								'bg-primary-200 text-gray-500 hover:bg-primary-400 hover:text-white'
								} transition-all duration-300`}
							aria-label="Next exercises"
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
						className="flex space-x-4 pb-3 w-full"
						style={{
							transform: `translateX(-${startIdx * (cardWidth + 16)}px)`,
							transition: 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
						}}
					>
						{exercises.map((exercise, index) => (
							<div
								key={exercise._id}
								ref={el => cardRefs.current[index] = el}
								className="flex-shrink-0"
								style={{ width: cardWidth ? cardWidth + 'px' : '100%' }}
								onMouseEnter={() => setHoveredCard(index)}
								onMouseLeave={() => setHoveredCard(null)}
							>
								<div className={`rounded-xl overflow-hidden shadow-xl border-2 border-primary-500 h-full relative group backdrop-blur-sm transition-all duration-500 
									${hoveredCard === index ? 'shadow-primary-500/30' : 'hover:shadow-primary-500'}`}
								>
									<div className="relative h-52">
										<div className="absolute top-4 right-4 z-20 bg-primary-600 text-white px-3 py-1 rounded-lg flex items-center shadow-md">
											{exercise.category}
										</div>

										{/* Image carousel */}
										<MediaCarousel images={exercise.image || []} />
									</div>

									<div className="p-6">
										<div className="flex justify-between mb-3">
											<div className='flex gap-2 items-center'>
												<span className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
													{exercise.subCategory}
												</span>
												<span className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full">
													{exercise.position}
												</span>
											</div>
											<div className='flex gap-2 text-gray-600 text-sm'>
												<div className="flex items-center">
													<Eye size={16} className="mr-1 text-primary-600" />
													<span>{exercise.views?.toLocaleString() || "0"}</span>
												</div>
												<div className="flex items-center">
													<Heart size={16} className="mr-1 text-primary-600" />
													<span>{exercise.favorites?.toLocaleString() || "0"}</span>
												</div>
											</div>
										</div>

										<h3 className="text-xl font-semibold text-gray-600 mb-3 group-hover:text-primary-500 transition-colors">
											{exercise.title}
										</h3>

										<p className="text-gray-500 text-sm mb-4 line-clamp-2">
											{exercise.description}
										</p>

										{/* Stats card - similar to TherapistCarousel but using exercise data */}
										<div className="bg-primary-500/50 rounded-xl p-4 grid grid-cols-4 gap-1 border border-gray-700/40 group-hover:border-primary-500/20 transition-all duration-300 mb-4">
											<div className="flex flex-col items-center text-center">
												<Repeat size={18} className="text-primary-600 mb-1" />
												<span className="text-white font-medium text-sm">{exercise.reps}</span>
												<span className="text-xs text-gray-600">Reps</span>
											</div>

											<div className="flex flex-col items-center text-center border-x border-gray-700/30">
												<Clock size={18} className="text-primary-600 mb-1" />
												<span className="text-white font-medium text-sm">{exercise.hold}</span>
												<span className="text-xs text-gray-600">Hold</span>
											</div>

											<div className="flex flex-col items-center text-center border-r border-gray-700/30">
												<Layers size={18} className="text-primary-600 mb-1" />
												<span className="text-white font-medium text-sm">{exercise.set}</span>
												<span className="text-xs text-gray-600">Sets</span>
											</div>

											<div className="flex flex-col items-center text-center">
												<Calendar size={18} className="text-primary-600 mb-1" />
												<span className="text-white font-medium text-sm">{exercise.perform.count} / {exercise.perform.type}</span>
												<span className="text-xs text-gray-600">Perform</span>
											</div>
										</div>
										<button
											onClick={() => navigate(`/exercise/${exercise._id}`)}
											className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
										>
											View Exercise
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Mobile navigation buttons (visible on smaller screens) */}
					{exercises.length > visibleCards && (
						<div className="sm:hidden flex justify-center mt-6 space-x-4">
							<button
								onClick={prevExercises}
								disabled={startIdx === 0 || isAnimating}
								className={`flex items-center justify-center w-10 h-10 rounded-full ${startIdx === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
									'bg-primary-600/20 text-primary-300 hover:bg-primary-600/40 hover:text-white'
									} transition-all duration-300`}
								aria-label="Previous exercises"
							>
								<ChevronLeft size={20} />
							</button>
							<button
								onClick={nextExercises}
								disabled={startIdx >= exercises.length - visibleCards || isAnimating}
								className={`flex items-center justify-center w-10 h-10 rounded-full ${startIdx >= exercises.length - visibleCards ? 'bg-gray-800 text-gray-600 cursor-not-allowed' :
									'bg-primary-600/20 text-primary-300 hover:bg-primary-600/40 hover:text-white'
									} transition-all duration-300`}
								aria-label="Next exercises"
							>
								<ChevronRight size={20} />
							</button>
						</div>
					)}

					{/* Pagination dots */}
					{exercises.length > visibleCards && (
						<div className="flex justify-center mt-6 space-x-2">
							{Array(Math.ceil((exercises.length - visibleCards + 1) / 1)).fill(0).map((_, i) => (
								<button
									key={i}
									onClick={() => goToSlide(i)}
									className={`w-2 h-2 rounded-full transition-all duration-300 ${i === Math.floor(startIdx / 1) ?
										'bg-gradient-to-r from-primary-500 to-primary-200 w-6' :
										'bg-gray-600 hover:bg-primary-400'
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

export default ExerciseCarousel;