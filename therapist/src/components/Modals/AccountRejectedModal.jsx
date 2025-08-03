import React from 'react';

const AccountRejectedModal = ({ onLgin, onClose }) => {

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-gray-900 rounded-lg p-6 max-w-lg w-full shadow-xl border-2 border-primary-500">
				<div className="flex flex-col items-center">
					<div className="w-16 h-16 bg-red-300 rounded-full flex items-center justify-center mb-4">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="red">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>

					<h2 className="text-2xl font-semibold text-white mb-2">Account Declined</h2>

					<p className="text-gray-600 text-center m-6 mt-0">
						Your therapist account has been Declined by administrator.
						Please register with new account details.
					</p>

					<div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
						<button
							onClick={onLgin}
							className="py-2 px-4 bg-primary-700 hover:bg-primary-900 text-white font-medium rounded-md transition-colors"
						>
							Login with Different Account
						</button>

						<button
							onClick={onClose}
							className="py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md transition-colors"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountRejectedModal;