import { Image } from 'lucide-react';
import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MediaCarousel = ({ images = [], videos = [] }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const mediaItems = [...videos.map(url => ({ type: 'video', url })), ...images.map(url => ({ type: 'image', url }))];

	if (mediaItems.length === 0) return <div className="w-full h-48 flex flex-col items-center justify-center bg-gray-700 rounded-lg">
		<Image size={30} className='text-gray-500'/>
		<p className="text-gray-500 text-center">No media available</p>
	</div>

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length);
	};

	const currentItem = mediaItems[currentIndex];
	const hasMultipleItems = mediaItems.length > 1;

	return (
		<div className="relative w-full h-full mb-4 rounded-lg overflow-hidden bg-gray-700 z-10">
			{currentItem.type === 'video' ? (
				<video
					src={currentItem.url}
					className="w-full h-full object-cover"
					autoPlay
					loop
					muted
				/>
			) : (
				<img
					src={currentItem.url}
					alt="Exercise visual"
					className="w-full min-h-full object-cover"
				/>
			)}

			{hasMultipleItems && (
				<>
					<button
						onClick={prevSlide}
						className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition"
					>
						<FaChevronLeft size={14} />
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition"
					>
						<FaChevronRight size={14} />
					</button>
					<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
						{mediaItems.map((_, idx) => (
							<button
								key={idx}
								onClick={() => setCurrentIndex(idx)}
								className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-gray-400'}`}
								aria-label={`Go to slide ${idx + 1}`}
							/>
						))}
					</div>
				</>
			)}

			<div className="absolute top-2 right-2 bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white">
				{currentIndex + 1}/{mediaItems.length}
			</div>
		</div>
	);
};

export default MediaCarousel