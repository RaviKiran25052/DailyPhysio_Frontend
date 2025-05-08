import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Heart, Film } from 'lucide-react';

const ExerciseCarousel = ({ exercises = [], loading = false }) => {
	// State for carousel positioning
	const [startIdx, setStartIdx] = useState(0);

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
		// Initialize image carousel indices for each card
		if (exercises.length > 0) {
			const imageIndices = {};
			exercises.forEach(exercise => {
				imageIndices[exercise._id] = 0;
			});
			setCardImageIndices(imageIndices);
		}
	}, [exercises]);

	// Navigation functions for main carousel
	const nextExercises = () => {
		setStartIdx(prev => Math.min(prev + 1, Math.max(0, exercises.length - visibleCards)));
	};

	const prevExercises = () => {
		setStartIdx(prev => Math.max(0, prev - 1));
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
			<div className="w-full h-64 bg-gray-600"></div>
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
			<div key={`skeleton-${index}`} className="px-3 w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
				<SkeletonCard />
			</div>
		));
	};

	return (
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
						{exercises.slice(startIdx, startIdx + visibleCards).map((exercise, index) => (
							<div key={exercise._id} className="px-3 w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
								<div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 h-full relative group">
									{/* Card number overlay */}
									<div className="absolute top-4 left-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-md">
										{startIdx + index + 1}
									</div>

									<div className="relative">
										{/* Image carousel */}
										{exercise.image && exercise.image.length > 0 && (
											<>
												<div className="w-full h-64 relative overflow-hidden">
													{exercise.image.map((img, imgIndex) => (
														<img
															key={imgIndex}
															src={img || '/api/placeholder/400/300'}
															alt={`${exercise.title} - image ${imgIndex + 1}`}
															className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ${imgIndex === cardImageIndices[exercise._id] ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
																}`}
														/>
													))}
												</div>

												{/* Image carousel controls */}
												{exercise.image.length > 1 && (
													<>
														<button
															onClick={() => prevImage(exercise._id, exercise.image.length)}
															className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hover:bg-purple-700 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
															aria-label="Previous image"
														>
															<ChevronLeft size={16} />
														</button>
														<button
															onClick={() => nextImage(exercise._id, exercise.image.length)}
															className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hover:bg-purple-700 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
															aria-label="Next image"
														>
															<ChevronRight size={16} />
														</button>
													</>
												)}

												{/* Image carousel pagination */}
												{exercise.image.length > 1 && (
													<div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
														{exercise.image.map((_, imgIndex) => (
															<button
																key={imgIndex}
																onClick={() => setCardImageIndices(prev => ({
																	...prev,
																	[exercise._id]: imgIndex
																}))}
																className={`w-2 h-2 rounded-full transition-all ${imgIndex === cardImageIndices[exercise._id]
																		? 'bg-purple-500 w-4'
																		: 'bg-gray-400 hover:bg-purple-400'
																	}`}
																aria-label={`Go to image ${imgIndex + 1}`}
															/>
														))}
													</div>
												)}
											</>
										)}

										<div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-lg flex items-center shadow-md">
											{exercise.category}
										</div>

										{exercise.video && (
											<div className="absolute bottom-4 right-4 z-10">
												<div className="bg-purple-800/80 p-2 rounded-full shadow-md">
													<Film size={20} className="text-white" />
												</div>
											</div>
										)}
									</div>

									<div className="p-6">
										<div className="flex flex-wrap gap-2 mb-3">
											<span className="bg-purple-900/40 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-800/50">
												{exercise.subCategory}
											</span>
											<span className="bg-purple-900/40 text-purple-200 text-xs px-3 py-1 rounded-full border border-purple-800/50">
												{exercise.position}
											</span>
										</div>

										<h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
											{exercise.title}
										</h3>

										<p className="text-gray-300 mb-4 line-clamp-2">
											{exercise.description}
										</p>

										<div className="flex justify-between text-sm text-gray-400 pt-3 border-t border-gray-600">
											<div className="flex items-center">
												<Eye size={16} className="mr-1 text-purple-400/70" />
												<span>{exercise.views.toLocaleString()}</span>
											</div>
											<div className="flex items-center">
												<Heart size={16} className="mr-1 text-purple-400/70" />
												<span>{exercise.favorites.toLocaleString()}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Navigation buttons */}
					{exercises.length > visibleCards && (
						<>
							<button
								onClick={prevExercises}
								disabled={startIdx === 0}
								className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 p-3 rounded-full shadow-lg ${startIdx === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors z-10`}
								aria-label="Previous exercises"
							>
								<ChevronLeft size={24} />
							</button>

							<button
								onClick={nextExercises}
								disabled={startIdx >= exercises.length - visibleCards}
								className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 p-3 rounded-full shadow-lg ${startIdx >= exercises.length - visibleCards ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors z-10`}
								aria-label="Next exercises"
							>
								<ChevronRight size={24} />
							</button>
						</>
					)}

					{/* Pagination dots */}
					{exercises.length > visibleCards && (
						<div className="flex justify-center mt-6 space-x-2">
							{Array(Math.max(1, exercises.length - visibleCards + 1)).fill(0).map((_, i) => (
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

export default ExerciseCarousel;