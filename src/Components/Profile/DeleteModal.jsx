import React from 'react'

const DeleteModal = ({ state, exercise, onConfirm, onCancel }) => {
	if (!state) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
				<h3 className="text-lg text-white font-medium mb-4">Delete Exercise</h3>
				<p className="text-gray-300 mb-6">
					Are you sure you want to delete "{exercise.title}"? This action cannot be undone.
				</p>
				<div className="flex justify-end space-x-3">
					<button
						className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
						onClick={onCancel}
					>
						Cancel
					</button>
					<button
						className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
						onClick={onConfirm}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal