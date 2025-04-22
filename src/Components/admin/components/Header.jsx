import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

const Header = ({ title, showBackButton, onBackClick, onHomeClick }) => {
	return (
		<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
			<button
				onClick={onHomeClick}
				className="flex items-center px-4 py-2 mb-4 sm:mb-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
			>
				<FaArrowLeft className="mr-2" />
				Back to Home
			</button>

			<div className="flex justify-between items-center mb-8 mt-4 sm:mt-0">
				<h2 className="text-3xl font-extrabold text-white">{title}</h2>

				{showBackButton && (
					<button
						onClick={onBackClick}
						className="flex items-center px-4 py-2 ml-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-purple-400 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
					>
						<FaArrowLeft className="mr-2" />
						Back
					</button>
				)}
			</div>
		</div>
	);
};

export default Header;