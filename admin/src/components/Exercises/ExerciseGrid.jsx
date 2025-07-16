import { Crown } from 'lucide-react';
import MediaCarousel from './MediaCarousel';

const ExerciseGrid = ({ exercises, totalExercises, onViewExercise, searchTerm }) => {

	if (totalExercises === 0) {
		return (
			<div className="text-center py-12">
				<p className="text-purple-300">
					No exercises found. {searchTerm ? 'Try a different search term or ' : ''}
					Click "Add New Exercise" to create one.
				</p>
			</div>
		);
	}
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{exercises.map((exercise) => (
				<div
					key={exercise._id}
					className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-700 hover:border-purple-500 flex flex-col"
				>
					<div className="relative h-48 overflow-hidden">
						<MediaCarousel images={exercise.image} video={exercise.video} />
						{exercise.isPremium && (
							<div className="absolute top-3 left-3 z-20 bg-yellow-600 rounded-lg p-2">
								<Crown size={16} />
							</div>
						)}
					</div>
					<div className="p-6 flex-grow">
						<h3 className="text-lg font-semibold text-purple-400 cursor-pointer"
							onClick={() => onViewExercise(exercise)}>{exercise.title}</h3>
						<p className="mt-2 text-white line-clamp-2 text-sm">{exercise.description}</p>
						<div className="flex flex-wrap gap-2 mt-4">
							{exercise.category && (
								<span className="bg-purple-900 text-purple-300 px-2 py-1 rounded-full text-xs">
									{exercise.category}
								</span>
							)}
							{exercise.position && (
								<span className="bg-gray-700 text-purple-300 px-2 py-1 rounded-full text-xs">
									{exercise.position}
								</span>
							)}
							{exercise.custom.createdBy !== "admin" && (
								<span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">
									Custom
								</span>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default ExerciseGrid;