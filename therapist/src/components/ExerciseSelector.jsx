import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiCloseLine } from 'react-icons/ri';
const API_URL = process.env.REACT_APP_API_URL;

const ExerciseSelector = ({ onSelect, onClose, selectedExercises }) => {
	const [exercises, setExercises] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const fetchExercises = async () => {
			try {
				const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
				const response = await axios.get(`${API_URL}/exercises`, {
					headers: { Authorization: `Bearer ${therapistInfo.token}` }
				});
				setExercises(Array.isArray(response.data) ? response.data : response.data.exercises || []);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching exercises:', error);
				setExercises([]);
				setLoading(false);
			}
		};

		fetchExercises();
	}, []);

	const filteredExercises = exercises.filter(exercise => {
		if (!exercise) return false;
		const searchLower = searchTerm.toLowerCase();
		return (
			(exercise.title?.toLowerCase().includes(searchLower) || false) &&
			!selectedExercises.includes(exercise._id)
		);
	});

	if (loading) {
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">Select Exercises</h3>
					<button onClick={onClose} className="text-gray-400 hover:text-white">
						<RiCloseLine size={24} />
					</button>
				</div>

				<input
					type="text"
					placeholder="Search exercises..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full p-2 mb-4 bg-gray-700 rounded-lg"
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{filteredExercises.map((exercise) => (
						<div
							key={exercise._id}
							className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600"
							onClick={() => onSelect(exercise._id)}
						>
							<img
								src={exercise.image[0]}
								alt={exercise.title}
								className="w-full h-32 object-cover rounded-lg mb-2"
							/>
							<h4 className="font-medium">{exercise.title}</h4>
							<div className="text-sm text-gray-400">
								{exercise.category} - {exercise.subCategory}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ExerciseSelector