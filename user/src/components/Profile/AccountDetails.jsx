import React from 'react'

const AccountDetails = ({ user, formatDate }) => {
	return (
		<div className="bg-primary-800 p-4 rounded-lg">
			<h3 className="text-primary-400 font-medium mb-2">Account Details</h3>
			<p className="text-gray-300 flex items-center mb-2">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
					<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
				</svg>
				Created: {formatDate(user.createdAt)}
			</p>
			<p className="text-gray-300 flex items-center">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
					<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
				</svg>
				Role: {user?.role === 'isUser' ? 'User' : user.role}
			</p>
		</div>
	);
};

export default AccountDetails