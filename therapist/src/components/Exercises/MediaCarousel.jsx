import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Image, Play, Pause, Maximize, Minimize, X } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL;

const MediaCarousel = ({ images = [], video = null }) => {
	// Create media items with video first if available
	const mediaItems = video
		? [{ type: 'video', url: video }, ...images.map(url => ({ type: 'image', url }))]
		: images.map(url => ({ type: 'image', url }));

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);
	const videoRefs = useRef({});
	const carouselRef = useRef(null);

	// If no media is available, display placeholder
	if (mediaItems.length === 0) {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/80 rounded-xl border border-gray-700/60 backdrop-blur-sm">
				<Image size={30} className="text-gray-500 mb-2" />
				<p className="text-gray-400 text-center">No media available</p>
			</div>
		);
	}

	const nextSlide = (e) => {
		e.stopPropagation();
		// Pause current video if changing slides
		const currentItem = mediaItems[currentIndex];
		if (currentItem.type === 'video' && videoRefs.current[currentIndex]) {
			videoRefs.current[currentIndex].pause();
		}
		setIsPlaying(false);
		setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
	};

	const prevSlide = (e) => {
		e.stopPropagation();
		// Pause current video if changing slides
		const currentItem = mediaItems[currentIndex];
		if (currentItem.type === 'video' && videoRefs.current[currentIndex]) {
			videoRefs.current[currentIndex].pause();
		}
		setIsPlaying(false);
		setCurrentIndex((prevIndex) => (prevIndex - 1 + mediaItems.length) % mediaItems.length);
	};

	const goToSlide = (idx, e) => {
		e.stopPropagation();
		// Pause current video if changing slides
		const currentItem = mediaItems[currentIndex];
		if (currentItem.type === 'video' && videoRefs.current[currentIndex]) {
			videoRefs.current[currentIndex].pause();
		}
		setIsPlaying(false);
		setCurrentIndex(idx);
	};

	const togglePlayPause = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const videoElement = videoRefs.current[currentIndex];

		if (videoElement) {
			if (isPlaying) {
				videoElement.pause();
			} else {
				videoElement.play().catch(err => {
					console.error("Error playing video:", err);
				});
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleMaximize = (e) => {
		e.stopPropagation();
		setIsMaximized(!isMaximized);
	};

	const closeMaximizedView = (e) => {
		e.stopPropagation();
		setIsMaximized(false);
	};

	const hasMultipleItems = mediaItems.length > 1;

	// Main carousel component
	const renderCarousel = (maximized = false) => (
		<div className={`relative w-full h-full overflow-hidden ${maximized ? '' : 'rounded-xl'}`}>
			{/* Media Display */}
			{mediaItems.map((item, idx) => (
				<div
					key={idx}
					className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ${idx === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
						}`}
				>
					{item.type === 'video' ? (
						<div className="relative w-full h-full">
							<video
								ref={el => videoRefs.current[idx] = el}
								src={item.url.startsWith("therapists")
									? `${API_URL}/uploads/${item.url}`
									: item.url
								}
								className="w-full h-full object-cover"
								loop
								controls={maximized}
								autoPlay={maximized}
								onPlay={() => setIsPlaying(true)}
								onPause={() => setIsPlaying(false)}
							/>
							{(idx === currentIndex && !maximized) && (
								<div
									className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer z-20"
									onClick={togglePlayPause}
								>
									<div className="bg-purple-600/80 hover:bg-purple-500 rounded-full p-4 transform hover:scale-110 transition-all duration-300">
										{isPlaying ? (
											<Pause size={24} className="text-white" />
										) : (
											<Play size={24} className="text-white" fill="white" />
										)}
									</div>
								</div>
							)}
						</div>
					) : (
						<img
							src={item.url.startsWith("therapists")
								? `${API_URL}/uploads/${item.url}`
								: item.url
							}
							alt={`Media item ${idx + 1}`}
							className="w-full h-full object-cover"
						/>
					)}
				</div>
			))}

			{/* Navigation Controls - Only show if multiple items */}
			{hasMultipleItems && (
				<div className="absolute inset-0 z-30 pointer-events-none">
					{/* Previous button */}
					<span
						onClick={prevSlide}
						className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hover:bg-purple-700 text-white pointer-events-auto"
						aria-label="Previous media"
					>
						<ChevronLeft size={16} />
					</span>

					{/* Next button */}
					<span
						onClick={nextSlide}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/70 p-2 rounded-full hover:bg-purple-700 text-white pointer-events-auto"
						aria-label="Next media"
					>
						<ChevronRight size={16} />
					</span>

					{/* Pagination indicators */}
					<div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
						{mediaItems.map((_, idx) => (
							<div
								key={idx}
								onClick={(e) => goToSlide(idx, e)}
								className={`w-2 h-2 rounded-full transition-all pointer-events-auto ${idx === currentIndex
									? 'bg-purple-500 w-4'
									: 'bg-gray-400 hover:bg-purple-400'
									}`}
								aria-label={`Go to media ${idx + 1}`}
							/>
						))}
					</div>
				</div>
			)}

			{/* Maximize button (only show on hover in normal mode) */}
			{!maximized && (
				<div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-40">
					<div
						onClick={toggleMaximize}
						className="bg-gray-800/70 p-2 rounded-full hover:bg-purple-700 text-white"
						aria-label="Maximize carousel"
					>
						<Maximize size={16} />
					</div>
				</div>
			)}

			{/* Minimize button (only in maximized view) */}
			{maximized && (
				<div className="absolute top-4 right-4 z-50 flex space-x-2">
					<span
						onClick={closeMaximizedView}
						className="bg-gray-800/70 p-2 rounded-full hover:bg-purple-700 text-white"
						aria-label="Close carousel"
					>
						<X size={16} />
					</span>
				</div>
			)}
		</div>
	);

	return (
		<>
			{/* Normal carousel view with hover group for showing maximize button */}
			<div ref={carouselRef} className="relative w-full h-full group">
				{renderCarousel(false)}
			</div>

			{/* Maximized view portal */}
			{isMaximized && createPortal(
				<div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
					<div className="w-full h-full md:w-5/6 md:h-5/6">
						{renderCarousel(true)}
					</div>
				</div>,
				document.body
			)}
		</>
	);
};

export default MediaCarousel;