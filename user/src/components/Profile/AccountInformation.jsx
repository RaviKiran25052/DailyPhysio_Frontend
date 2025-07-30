import React from 'react'

const AccountInformation = ({ user, openPasswordChangeModal }) => {
	return (
		<div className="bg-primary-800 p-4 rounded-lg">
			<h3 className="text-primary-400 font-medium mb-2">Account Information</h3>
			<p className="text-gray-300 flex items-center mb-2">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
					<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
					<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
				</svg>
				{user.email}
			</p>
			<div className="mt-3">
				<button
					onClick={openPasswordChangeModal}
					className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700 transition"
				>
					Change Password
				</button>
			</div>
		</div>
	);
};

export default AccountInformation