import React, { useRef } from 'react';
import AdminExerciseForm from '../AdminExerciseForm';

const ExerciseFormModal = ({ isOpen, onClose, exercise, isEdit, onSave, adminToken }) => {
	const modalRef = useRef();

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
			<div
				ref={modalRef}
				className="bg-gray-800 rounded-lg shadow-xl overflow-auto max-w-4xl w-full max-h-[90vh] border border-gray-700"
			>
				<div className="p-6">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-2xl font-bold text-white">
							{isEdit ? 'Edit Exercise' : 'Add New Exercise'}
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white focus:outline-none"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<AdminExerciseForm
						exercise={exercise}
						isEdit={isEdit}
						onSave={onSave}
						adminToken={adminToken}
					/>
				</div>
			</div>
		</div>
	);
};

export default ExerciseFormModal;