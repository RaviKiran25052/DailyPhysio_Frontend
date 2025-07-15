import { useState } from 'react';
import { Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import MediaCarousel from '../MediaCarousel';

const ExerciseCarousel = ({ exercises = [], onExerciseClick }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	// Handle empty exercises array
	if (!exercises || exercises.length === 0) {
		return (
			<div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 p-8 text-center">
				<p className="text-gray-300">No exercises found</p>
			</div>
		);
	}

	const nextExercise = () => {
		if (isAnimating || exercises.length <= 1) return;

		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % exercises.length);
			setIsAnimating(false);
		}, 300);
	};

	const prevExercise = () => {
		if (isAnimating || exercises.length <= 1) return;

		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex((prevIndex) => (prevIndex - 1 + exercises.length) % exercises.length);
			setIsAnimating(false);
		}, 300);
	};

	const handleExerciseClick = (id) => {
		if (onExerciseClick) {
			onExerciseClick(id);
		}
	};

	const goToSlide = (index) => {
		if (currentIndex === index || isAnimating) return;

		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex(index);
			setIsAnimating(false);
		}, 300);
	};

	return (
		<div className="relative">
			{/* Carousel container */}
			<div className="relative overflow-hidden h-auto">
				<div className="flex justify-center items-center">
					{/* Current Card */}
					<div
						className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 w-full max-w-md transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
							}`}
					>
						<div className="flex flex-col">
							{/* Media preview */}
							<div className="h-48 bg-gray-700 relative">
								{exercises[currentIndex]?.video?.length > 0 || exercises[currentIndex]?.image?.length > 0 ? (
									<div className="h-full">
										<MediaCarousel images={exercises[currentIndex].image} video={exercises[currentIndex].video} />
									</div>
								) : (
									<div className="h-full flex items-center justify-center bg-gray-700 text-gray-500">
										<p>No media</p>
									</div>
								)}
								{exercises[currentIndex].isPremium && (
									<div className="absolute top-2 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
										Premium
									</div>
								)}
							</div>

							{/* Content */}
							<div className="p-6 flex flex-col">
								<h3
									className="text-xl font-medium text-white mb-3 cursor-pointer hover:text-purple-300 transition-colors"
									onClick={() => handleExerciseClick(exercises[currentIndex]._id)}
								>
									{exercises[currentIndex].title}
								</h3>
								<p className="text-gray-300 text-sm mb-4">{exercises[currentIndex].description}</p>

								{/* Categories */}
								<div className="flex flex-wrap gap-2 mb-4">
									<span className="bg-purple-900/60 text-purple-300 text-xs px-3 py-1 rounded-full">
										{exercises[currentIndex].category}
									</span>
									<span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
										{exercises[currentIndex].position}
									</span>
								</div>

								{/* Action button */}
								<button
									onClick={() => handleExerciseClick(exercises[currentIndex]._id)}
									className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
								>
									View Exercise
								</button>

								{/* Stats */}
								<div className="flex items-center justify-between text-gray-400 text-sm mt-4 pt-4 border-t border-gray-700">
									<div className="flex items-center">
										<Eye size={16} className="mr-1" />
										<span>{exercises[currentIndex].views || 0}</span>
									</div>
									<div className="flex items-center">
										<Heart size={16} className="mr-1" />
										<span>{exercises[currentIndex].favorites || 0}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation controls at the bottom */}
			{exercises.length > 1 && (
				<div className="flex items-center justify-center mt-6 gap-4">
					{/* Left button */}
					<button
						onClick={prevExercise}
						disabled={isAnimating}
						className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors shadow-lg disabled:opacity-50"
						aria-label="Previous exercise"
					>
						<ChevronLeft size={20} />
					</button>

					{/* Indicator dots */}
					<div className="flex gap-2">
						{exercises.map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								disabled={isAnimating}
								className={`h-2 rounded-full transition-all ${currentIndex === index ? 'w-6 bg-purple-600' : 'w-2 bg-gray-600 hover:bg-gray-500'
									}`}
								aria-label={`Go to exercise ${index + 1}`}
							/>
						))}
					</div>

					{/* Right button */}
					<button
						onClick={nextExercise}
						disabled={isAnimating}
						className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors shadow-lg disabled:opacity-50"
						aria-label="Next exercise"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			)}
		</div>
	);
};

export default ExerciseCarousel;