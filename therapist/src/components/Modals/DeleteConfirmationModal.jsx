const DeleteConfirmationModal = ({ isOpen, onClose, patient, onConfirm }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
				<h3 className="text-lg font-semibold mb-4">Delete Consultation</h3>
				<p className="text-gray-300 mb-6">
					Are you sure you want to delete the consultation with {patient}? This action cannot be undone.
				</p>
				<div className="flex justify-end space-x-4">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmationModal