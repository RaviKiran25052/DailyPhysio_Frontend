import React, { useState } from 'react'

const ProfileEditModal = ({ isOpen, onClose, profileData, onProfileChange, onSubmit, loading }) => {
	const [showConfirmation, setShowConfirmation] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setShowConfirmation(true);
	};

	if (!isOpen) return null;

	return (
		<>

			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
				<div className="relative bg-primary-800 rounded-xl shadow-xl max-w-md w-full p-6">
					<button
						onClick={loading ? null : onClose}
						className="absolute top-3 right-3 text-gray-400 hover:text-white"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
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
								className="w-full bg-primary-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
								disabled={loading}
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
								className="w-full bg-primary-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
								disabled={loading}
							/>
						</div>

						<div className="flex justify-end space-x-3 pt-2">
							<button
								type="button"
								onClick={onClose}
								className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
								disabled={loading}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-500 transition"
								disabled={loading}
							>
								Save Changes
							</button>
						</div>
					</form>
				</div>
			</div>

			{showConfirmation && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="relative bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
						<button
							onClick={loading ? null : () => setShowConfirmation(false)}
							className="absolute top-3 right-3 text-gray-400 hover:text-white"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
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
									disabled={loading}
								>
									Cancel
								</button>
								<button
									onClick={() => {
										onSubmit();
										setShowConfirmation(false);
										onClose();
									}}
									className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-500 transition flex items-center justify-center"
									disabled={loading}
								>
									{loading ? (
										<>
											<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Saving...
										</>
									) : 'Confirm'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfileEditModal