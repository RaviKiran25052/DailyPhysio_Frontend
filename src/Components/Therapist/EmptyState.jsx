import React from 'react';

// EmptyState Component
const EmptyState = ({ title, message, buttonText, onClick, icon }) => {
	return (
		<div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-lg p-8 text-center">
			{icon && <div className="text-purple-400 mb-4">{icon}</div>}
			<h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
			<p className="text-gray-400 mb-8 max-w-md">{message}</p>
			{buttonText && onClick && (
				<button
					onClick={onClick}
					className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 text-white font-medium"
				>
					{buttonText}
				</button>
			)}
		</div>
	);
};

export default EmptyState;