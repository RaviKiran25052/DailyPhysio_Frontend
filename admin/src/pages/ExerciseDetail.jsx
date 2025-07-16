import { Crown } from 'lucide-react';
import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaArrowCircleLeft, FaArrowCircleRight, FaCalendarAlt, FaEye, FaStar, FaClock, FaDumbbell } from 'react-icons/fa';

const ExerciseDetail = ({ exercise, onEdit, onDelete, onBack }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const goToNextImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === exercise.image.length - 1 ? 0 : prevIndex + 1
		);
	};

	const goToPrevImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? exercise.image.length - 1 : prevIndex - 1
		);
	};

	// Format date
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	return (
		<div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
			{/* Header with back button */}
			<div className="p-6 border-b border-gray-700">
				<div className="flex justify-between items-center">
					<button
						onClick={onBack}
						className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
					>
						<FaArrowLeft className="mr-2" />
						Back to List
					</button>

					<div className="flex space-x-3">
						<button
							onClick={() => onEdit(exercise)}
							className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
						>
							Edit
						</button>

						<button
							onClick={() => onDelete(exercise._id)}
							className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
						>
							Delete
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
				{/* Left Column - Text Information */}
				<div className="space-y-6">
					<div>
						<h2 className="text-2xl font-bold text-purple-400 mb-2 flex items-center gap-4">
							<p>{exercise.title}</p>
							{exercise.isPremium &&
								<div className='bg-yellow-500 rounded-md z-10 p-1'>
									<Crown size={16} className='text-gray-800' />
								</div>
							}
							{exercise.custom.createdBy !== "admin"  && (
								<span className="border-2 border-blue-600 text-blue-500 px-3 py-1 rounded-full text-xs font-thin">
									Custom
								</span>
							)}
						</h2>
						<div className="h-px mb-2 bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>

						<div className="flex justify-between gap-1 my-3">
							<div className='flex gap-1'>
								<span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">{exercise.category}</span>
								<span className='text-white text-lg font-thin'>/</span>
								<span className="text-purple-300 py-1 rounded-full text-sm">{exercise.subCategory}</span>
							</div>
							<span className="bg-gray-700 text-purple-300 px-3 py-1 rounded-full text-sm">
								Position: {exercise.position}
							</span>
						</div>

						<p className="text-gray-300 mb-4">{exercise.description}</p>
					</div>

					<div className="bg-gray-700 rounded-lg p-4">
						<h3 className="text-lg font-semibold text-purple-300 mb-3">Instructions</h3>
						<p className="text-gray-300">{exercise.instruction}</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
							<FaDumbbell className="text-purple-400 text-xl mb-2" />
							<h4 className="text-sm font-medium text-purple-300">Sets</h4>
							<p className="text-xl font-bold text-white">{exercise.set}</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
							<FaDumbbell className="text-purple-400 text-xl mb-2" />
							<h4 className="text-sm font-medium text-purple-300">Reps</h4>
							<p className="text-xl font-bold text-white">{exercise.reps}</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
							<FaClock className="text-purple-400 text-xl mb-2" />
							<h4 className="text-sm font-medium text-purple-300">Hold (sec)</h4>
							<p className="text-xl font-bold text-white">{exercise.hold}</p>
						</div>
						<div className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
							<FaClock className="text-purple-400 text-xl mb-2" />
							<h4 className="text-sm font-medium text-purple-300">Perform</h4>
							<p className="text-xl font-bold text-white">{exercise.perform.count} {exercise.perform.type}</p>
						</div>
					</div>

					<div className="bg-gray-700 rounded-lg p-4">
						<h4 className="text-sm font-medium text-purple-400 mb-3">Exercise Stats</h4>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center">
								<FaEye className="text-gray-400 mr-2" />
								<div>
									<p className="text-sm text-gray-400">Views</p>
									<p className="text-lg font-semibold text-white">{exercise.views}</p>
								</div>
							</div>
							<div className="flex items-center">
								<FaStar className="text-yellow-400 mr-2" />
								<div>
									<p className="text-sm text-gray-400">Favorites</p>
									<p className="text-lg font-semibold text-white">{exercise.favorites}</p>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-gray-700 rounded-lg p-4">
						<h4 className="text-sm font-medium text-purple-400 mb-3">Additional Information</h4>
						<div className="space-y-2 flex justify-between">
							<div className="flex items-center">
								<FaCalendarAlt className="text-gray-400 mr-2" />
								<div>
									<p className="text-sm text-gray-400">Created</p>
									<p className="text-gray-300">{formatDate(exercise.createdAt)}</p>
								</div>
							</div>
							<div className="flex items-center">
								<FaCalendarAlt className="text-gray-400 mr-2" />
								<div>
									<p className="text-sm text-gray-400">Last Updated</p>
									<p className="text-gray-300">{formatDate(exercise.updatedAt)}</p>
								</div>
							</div>
							{exercise.custom && exercise.custom.createdBy && (
								<div>
									<p className="text-sm text-gray-400">Created By</p>
									<p className="text-gray-300">{exercise.custom.createdBy}</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Right Column - Media and Stats */}
				<div className="space-y-6">
					{exercise.image && exercise.image.length > 0 && (
						<div className="bg-gray-700 rounded-lg p-4">
							<h4 className="text-sm font-medium text-purple-400 mb-3">Exercise Images</h4>
							<div className="relative">
								<img
									src={exercise.image[currentImageIndex]}
									alt={`${exercise.title} - Image ${currentImageIndex + 1}`}
									className="w-full h-64 object-contain rounded-md"
								/>
								{exercise.image.length > 1 && (
									<>
										<button
											className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-700"
											onClick={goToPrevImage}
										>
											<FaArrowCircleLeft className="text-xl" />
										</button>
										<button
											className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-gray-700"
											onClick={goToNextImage}
										>
											<FaArrowCircleRight className="text-xl" />
										</button>
										<div className="flex justify-center mt-2 space-x-1">
											{exercise.image.map((_, index) => (
												<button
													key={index}
													className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-purple-500' : 'bg-gray-500'
														}`}
													onClick={() => setCurrentImageIndex(index)}
												/>
											))}
										</div>
									</>
								)}
							</div>
						</div>
					)}

					{exercise.video && (
						<div className="bg-gray-700 rounded-lg p-4">
							<h4 className="text-sm font-medium text-purple-400 mb-3">Exercise Video</h4>
							<video
								src={exercise.video}
								controls
								className="w-full rounded-md"
							>
								Your browser does not support the video tag.
							</video>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ExerciseDetail;