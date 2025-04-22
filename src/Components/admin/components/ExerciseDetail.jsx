import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const ExerciseDetail = ({ exercise, onEdit, onDelete, onBack }) => {
	return (
		<div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
			<div className="p-6">
				<div className="flex justify-between items-center mb-6">
					<button
						onClick={onBack}
						className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
					>
						<FaArrowLeft className="mr-2" />
						Back to List
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h3 className="text-xl font-bold text-purple-400 mb-4">{exercise.title}</h3>
						<p className="text-purple-300 mb-4">{exercise.description}</p>

						<div className="flex flex-wrap gap-2 mb-6">
							{exercise.category && (
								<span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
									Category: {exercise.category}
								</span>
							)}
							{exercise.position && (
								<span className="bg-gray-700 text-purple-300 px-3 py-1 rounded-full text-sm">
									Position: {exercise.position}
								</span>
							)}
							{exercise.isPremium && (
								<span className="bg-yellow-700 text-yellow-300 px-3 py-1 rounded-full text-sm">
									Premium Exercise
								</span>
							)}
							{exercise.isCustom && (
								<span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm">
									Custom Exercise
								</span>
							)}
						</div>

						<div className="flex space-x-4">
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

					<div className="space-y-6">
						{exercise.image && (
							<div>
								<h4 className="text-sm font-medium text-purple-400 mb-2">Exercise Image</h4>
								<img
									src={exercise.image}
									alt={exercise.title}
									className="max-h-64 rounded-md"
								/>
							</div>
						)}

						{exercise.video && (
							<div>
								<h4 className="text-sm font-medium text-purple-400 mb-2">Exercise Video</h4>
								<video
									src={exercise.video}
									controls
									className="max-h-64 w-full rounded-md"
								>
									Your browser does not support the video tag.
								</video>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExerciseDetail;