import React, { useState } from 'react'
import ModalBackdrop from './ModalBackdrop';

const ProfileEditModal = ({ isOpen, onClose, profileData, onProfileChange, onSubmit }) => {
	const [showConfirmation, setShowConfirmation] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setShowConfirmation(true);
	};

	if (!isOpen) return null;

	return (
		<>
			<ModalBackdrop onClose={onClose}>
				<h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="fullName" className="block text-sm text-gray-300 mb-1">Full Name</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							value={profileData.fullName}
							onChange={onProfileChange}
							className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
						/>
					</div>
					<div>
						<label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email</label>
						<input
							type="email"
							id="email"
							name="email"
							value={profileData.email}
							onChange={onProfileChange}
							className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
						/>
					</div>

					<div className="flex justify-end space-x-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition"
						>
							Save Changes
						</button>
					</div>
				</form>
			</ModalBackdrop>

			{showConfirmation && (
				<ModalBackdrop onClose={() => setShowConfirmation(false)}>
					<div className="text-center">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<h3 className="text-lg font-medium text-white mb-2">Save Changes?</h3>
						<p className="text-gray-300 mb-6">Are you sure you want to save these changes to your profile?</p>
						<div className="flex justify-center space-x-4">
							<button
								onClick={() => setShowConfirmation(false)}
								className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									onSubmit();
									setShowConfirmation(false);
									onClose();
								}}
								className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition"
							>
								Confirm
							</button>
						</div>
					</div>
				</ModalBackdrop>
			)}
		</>
	);
};

export default ProfileEditModal