import { Calendar, SquareArrowOutUpRight } from 'lucide-react';
import React from 'react';
import MediaCarousel from './MediaCarousel';
import { Eye, Heart, Lock, Globe, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExerciseCard = ({ exercise, onTypeChange, onDelete }) => {
	const navigate = useNavigate();
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		return date.toLocaleDateString();
	};

	const categoryColors = {
		'Ankle and Foot': 'text-blue-300',
		'Cervical': 'text-green-300',
		'Education': 'text-yellow-300',
		'Elbow and Hand': 'text-orange-300',
		'Hip and Knee': 'text-purple-300',
		'Lumbar Thoracic': 'text-red-300',
		'Oral Motor': 'text-pink-300',
		'Shoulder': 'text-indigo-300',
		'Special': 'text-teal-300'
	};

	const color = categoryColors[exercise.category] || 'text-gray-300';
	return (
		<div className="flex flex-col justify-between bg-gray-800 hover:bg-gray-750 rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1">
			<MediaCarousel images={exercise.image} videos={exercise.video} />

			<div className="p-4">
				<div className="flex justify-between items-start mb-3 ">
					<h3
						className="font-medium flex gap-2 text-white hover:text-purple-300 cursor-pointer transition text-lg"
						onClick={() => navigate(`/exercise/${exercise._id}`)}>
						{exercise.title}<SquareArrowOutUpRight size={14} />
					</h3>
					<div className="flex items-center text-xs text-gray-400">
						<Calendar size={14} className="mr-1" />
						<span>{formatDate(exercise.createdAt)}</span>
					</div>
				</div>

				<p className="text-sm text-gray-300 mb-3">{exercise.description}</p>

				<div className="border-t border-gray-700 pt-3 flex justify-between items-center">
					<div className="flex items-center text-xs text-gray-400">
						<div className="flex items-center mr-4">
							<Eye size={14} className="mr-1" />
							<span>{exercise.views}</span>
						</div>
						<div className="flex items-center">
							<Heart size={14} className="mr-1" />
							<span>{exercise.favorites}</span>
						</div>
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => onTypeChange(exercise)}
							className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition flex items-center"
						>
							{exercise.custom.type === 'public' ? (
								<>
									<Lock size={12} className="mr-1" />
									Make Private
								</>
							) : (
								<>
									<Globe size={12} className="mr-1" />
									Make Public
								</>
							)}
						</button>
						<button
							onClick={() => onDelete(exercise)}
							className="px-3 py-1 border-2 border-purple-500 hover:text-red-300 hover:border-red-500 text-white text-xs rounded transition flex items-center"
						>
							<Trash2 size={12} className="mr-1" />
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExerciseCard