import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';

const MediaCarousel = ({ images = [], video = null }) => {
	// Create media items with video first if available
	const mediaItems = video
		? [{ type: 'video', url: video }, ...images.map(url => ({ type: 'image', url }))]
		: images.map(url => ({ type: 'image', url }));

	const [currentIndex, setCurrentIndex] = useState(0);

	// If no media is available, display placeholder
	if (mediaItems.length === 0) {
		return (
			<div className="w-full flex flex-col items-center justify-center bg-gray-800/80 rounded-xl border border-gray-700/60 backdrop-blur-sm">
				<Image size={30} className="text-gray-500 mb-2" />
				<p className="text-gray-400 text-center">No media available</p>
			</div>
		);
	}

	const nextSlide = (e) => {
		e.stopPropagation();
		setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
	};

	const prevSlide = (e) => {
		e.stopPropagation();
		setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length);
	};

	const goToSlide = (idx, e) => {
		e.stopPropagation();
		setCurrentIndex(idx);
	};

	const hasMultipleItems = mediaItems.length > 1;

	return (
		<div className="relative w-full h-full overflow-hidden rounded-xl group">
			{/* Media Display */}
			{mediaItems.map((item, idx) => (
				<div
					key={idx}
					className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ${idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
						}`}
				>
					{item.type === 'video' ? (
						<video
							src={item.url || '/api/placeholder/400/300'}
							className="w-full h-full object-cover"
							autoPlay
							loop
							muted
						/>
					) : (
						<img
							src={item.url || '/api/placeholder/400/300'}
							alt={`Media item ${idx + 1}`}
							className="w-full h-full object-cover"
						/>
					)}
				</div>
			))}

			{/* Navigation Controls - Only show if multiple items */}
			{hasMultipleItems && (
				<>
					{/* Previous button */}
					<button
						onClick={prevSlide}
						className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hover:bg-purple-700 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
						aria-label="Previous media"
					>
						<ChevronLeft size={16} />
					</button>

					{/* Next button */}
					<button
						onClick={nextSlide}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hover:bg-purple-700 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity"
						aria-label="Next media"
					>
						<ChevronRight size={16} />
					</button>

					{/* Pagination indicators */}
					<div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
						{mediaItems.map((_, idx) => (
							<button
								key={idx}
								onClick={(e) => goToSlide(idx, e)}
								className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
										? 'bg-purple-500 w-4'
										: 'bg-gray-400 hover:bg-purple-400'
									}`}
								aria-label={`Go to media ${idx + 1}`}
							/>
						))}
					</div>
				</>
			)}

			{/* Media counter badge */}
			<div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-lg flex items-center shadow-md text-sm">
				{currentIndex + 1}/{mediaItems.length}
			</div>
		</div>
	);
};

export default MediaCarousel;