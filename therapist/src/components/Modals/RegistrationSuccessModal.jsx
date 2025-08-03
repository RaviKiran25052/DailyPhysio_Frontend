import React from 'react';

const RegistrationSuccessModal = ({ onClose }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full shadow-xl border-2 border-primary-500">
				<div className="flex flex-col items-center">
					<div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</div>

					<h2 className="text-2xl font-semibold text-white mb-2">Registration Successful</h2>

					<p className="text-gray-500 text-center m-6 mt-2">
						Thank you for registering as a therapist. Your account has been created successfully, but requires administrator approval before you can access the platform.
					</p>

					<p className="text-gray-500 text-center m-6 mt-0">
						You will receive an email notification once your account has been activated. This process typically takes 24-48 hours during business days.
					</p>

					<button
						onClick={onClose}
						className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
					>
						I Understand
					</button>
				</div>
			</div>
		</div>
	);
};

export default RegistrationSuccessModal;