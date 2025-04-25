import React from 'react';

const EmptyState = ({ title, message, buttonText, onClick }) => {
	return (
		<div className="flex flex-col items-center justify-center h-64 bg-gray-800 rounded-lg p-8 text-center">
			<h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
			<p className="text-gray-400 mb-6">{message}</p>
			{buttonText && onClick && (
				<button
					onClick={onClick}
					className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
				>
					{buttonText}
				</button>
			)}
		</div>
	);
};

export default EmptyState;