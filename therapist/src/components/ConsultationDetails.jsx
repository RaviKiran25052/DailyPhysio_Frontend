import React, { useState } from 'react';
import axios from 'axios';
import { RiArrowLeftLine, RiUserLine, RiCalendarLine, RiInformationLine, RiRunLine, RiAddLine, RiDeleteBinLine, RiCloseLine } from 'react-icons/ri';
import ExerciseSelector from './ExerciseSelector';
import DeleteConfirmationModal from './Modals/DeleteConfirmationModal';
import MediaCarousel from './Exercises/MediaCarousel';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const ConsultationDetails = ({ consultation, onBack, onUpdate }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [activeDays, setActiveDays] = useState(getDateDifference(consultation.request?.expiresOn));
	const [notes, setNotes] = useState(consultation.notes || '');
	const [recommendedExercises, setRecommendedExercises] = useState(consultation.recommendedExercises || []);
	const [showExerciseSelector, setShowExerciseSelector] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
	const navigate = useNavigate();

	function getDateDifference(expiresOn) {
		const expiresDate = new Date(expiresOn);
		const today = new Date();
		const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const expiresMidnight = new Date(expiresDate.getFullYear(), expiresDate.getMonth(), expiresDate.getDate());
		const diffTime = expiresMidnight - todayMidnight;
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	const handleSave = async () => {
		try {
			const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));

			const response = await axios.put(
				`${API_URL}/therapist/consultations/${consultation._id}`,
				{
					activeDays,
					desp: notes,
					recommendedExercises
				},
				{
					headers: { Authorization: `Bearer ${therapistInfo.token}` }
				}
			);

			if (response.data) {
				setIsEditing(false);
				if (onUpdate) onUpdate(response.data);
			}
		} catch (error) {
			console.error('Error updating consultation:', error);
		}
	};

	const handleCancel = () => {
		setActiveDays(getDateDifference(consultation.request?.expiresOn));
		setNotes(consultation.notes || '');
		setRecommendedExercises(consultation.recommendedExercises);
		setIsEditing(false);
	};

	const handleRemoveExercise = (exerciseId) => {
		setRecommendedExercises(prev => prev.filter(ex => ex._id !== exerciseId));
	};

	const handleAddExercise = async (exerciseId) => {
		try {
			const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
			const response = await axios.get(`${API_URL}/therapist/exercises`, {
				headers: { Authorization: `Bearer ${therapistInfo.token}` }
			});

			const exercise = response.data.find(ex => ex._id === exerciseId);
			if (exercise) {
				setRecommendedExercises(prev => [...prev, exercise]);
			}
			setShowExerciseSelector(false);
		} catch (error) {
			console.error('Error fetching exercise details:', error);
		}
	};

	const handleDelete = async () => {
		try {
			const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
			await axios.delete(
				`${API_URL}/therapist/consultations/${consultation._id}`,
				{
					headers: { Authorization: `Bearer ${therapistInfo.token}` }
				}
			);
			onBack();
			if (onUpdate) onUpdate();
		} catch (error) {
			console.error('Error deleting consultation:', error);
		}
	};

	return (
		<div className="animate-fadeIn">
			{showExerciseSelector && (
				<ExerciseSelector
					onSelect={handleAddExercise}
					onClose={() => setShowExerciseSelector(false)}
					selectedExercises={recommendedExercises.map(ex => ex._id)}
				/>
			)}

			<DeleteConfirmationModal
				isOpen={showDeleteConfirmation}
				onClose={() => setShowDeleteConfirmation(false)}
				patient={consultation.patient_id.fullName}
				onConfirm={handleDelete}
			/>

			<div className="flex justify-between items-center mx-6 mt-6">
				<button
					onClick={onBack}
					className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 border-2 border-gray-500 p-2 rounded-md"
				>
					<RiArrowLeftLine size={20} />
					<span>Back to Consultations</span>
				</button>
			</div>

			<div className="p-6 text-white">
				<div className="bg-primary-800 rounded-lg p-6 mb-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<RiUserLine className="mr-2 text-primary-500" />
						Patient Information
					</h3>
					<div className='flex justify-between items-center'>
						<div className="flex items-center space-x-4">
							<img
								src={consultation.patient_id.profileImage}
								alt={consultation.patient_id.fullName}
								className="w-16 h-16 rounded-full object-cover"
							/>
							<div>
								<div className="font-medium text-lg">
									{consultation.patient_id.fullName}
									<span className={`px-3 py-1 ml-4 rounded-full text-base ${consultation.request.status === 'active'
										? 'bg-green-500 bg-opacity-20 text-green-500'
										: 'bg-yellow-500 bg-opacity-20 text-yellow-500'
										}`}>
										{consultation.request.status}
									</span>
								</div>
								<div className="text-gray-400">{consultation.patient_id.email}</div>
							</div>
						</div>
						{isEditing ? (
							<div className="space-x-2">
								<button
									onClick={handleCancel}
									className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
								>
									Cancel
								</button>
								<button
									onClick={handleSave}
									className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
								>
									Save
								</button>
							</div>
						) : (
							<div className='flex items-center space-x-4'>
								<button
									onClick={() => setShowDeleteConfirmation(true)}
									className="flex items-center space-x-2 text-red-400 hover:text-white border border-red-400 hover:border-white p-2 rounded-md"
								>
									<RiDeleteBinLine size={20} />
									<span>Delete Consultation</span>
								</button>
								<button
									onClick={() => setIsEditing(true)}
									className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
								>
									Edit
								</button>
							</div>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="bg-primary-800 rounded-lg p-6">
						<h3 className="text-lg font-semibold mb-4 flex items-center">
							<RiCalendarLine className="mr-2 text-primary-500" />
							Duration
						</h3>
						<div className="space-y-3">
							<div>
								<div className="text-gray-400">Created On</div>
								<div className="font-medium">
									{new Date(consultation.createdAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
								</div>
							</div>
							<div>
								<div className="text-gray-400">Active Days</div>
								{isEditing ? (
									<input
										type="number"
										value={Math.max(activeDays, 0)}
										onChange={(e) => setActiveDays(parseInt(e.target.value))}
										className="w-24 px-2 py-1 bg-primary-700 rounded border border-gray-600"
										min="1"
									/>
								) : (
									<div className="font-medium">{activeDays > 0 ? `${activeDays} days` : `deactivated ${Math.abs(activeDays)} days back`}</div>
								)}
							</div>
						</div>
					</div>

					<div className="bg-primary-800 rounded-lg p-6">
						<h3 className="text-lg font-semibold mb-4 flex items-center">
							<RiInformationLine className="mr-2 text-primary-500" />
							Notes
						</h3>
						{isEditing ? (
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className="w-full h-32 px-3 py-2 bg-primary-700 rounded border border-gray-600 resize-none"
								placeholder="Add notes here..."
							/>
						) : (
							<p className="text-gray-300">{notes || 'No notes provided'}</p>
						)}
					</div>
				</div>

				<div className="bg-primary-800 rounded-lg p-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-semibold flex items-center">
							<RiRunLine className="mr-2 text-primary-500" />
							Recommended Exercises
						</h3>
						{isEditing && (
							<button
								onClick={() => setShowExerciseSelector(true)}
								className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
							>
								<RiAddLine />
								<span>Add Exercise</span>
							</button>
						)}
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{recommendedExercises.map((exercise) => (
							<div
								key={exercise._id}
								className="bg-primary-700 rounded-lg p-4 relative cursor-pointer hover:bg-primary-600 transition-all duration-300"
								onClick={() => navigate(`/exercise/${exercise._id}`)}
							>
								{isEditing && (
									<button
										onClick={() => handleRemoveExercise(exercise._id)}
										className="absolute -top-2 -right-2 rounded-md text-white bg-red-500 hover:bg-red-600"
									>
										<RiCloseLine size={20} />
									</button>
								)}
								<div className="mb-3 h-40">
									<MediaCarousel
										images={exercise.image}
										video={exercise.video}
									/>
								</div>
								<h4 className="font-medium mb-2">{exercise.title}</h4>
								<div className="text-sm text-gray-400 mb-2">
									{exercise.category} - {exercise.subCategory}
								</div>
								<div className="text-sm">
									<span className="text-primary-400">Sets:</span> {exercise.set} |
									<span className="text-primary-400"> Reps:</span> {exercise.reps} |
									<span className="text-primary-400"> Hold:</span> {exercise.hold}s
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConsultationDetails