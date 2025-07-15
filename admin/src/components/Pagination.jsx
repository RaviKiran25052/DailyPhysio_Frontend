import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const renderPageNumbers = () => {
		const pageNumbers = [];

		for (let i = 1; i <= totalPages; i++) {
			// Always show first and last page
			// Also show 1 page before and after current page
			// Use ellipsis for the rest
			if (
				i === 1 ||
				i === totalPages ||
				(i >= currentPage - 1 && i <= currentPage + 1)
			) {
				pageNumbers.push(
					<button
						key={i}
						onClick={() => onPageChange(i)}
						className={`px-3 py-1 rounded-md ${currentPage === i
								? 'bg-purple-600 text-white'
								: 'bg-gray-800 text-purple-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
							}`}
					>
						{i}
					</button>
				);
			} else if (
				(i === 2 && currentPage > 3) ||
				(i === totalPages - 1 && currentPage < totalPages - 2)
			) {
				// Show ellipsis for skipped pages
				pageNumbers.push(
					<span key={i} className="px-2 text-gray-500">...</span>
				);
			}
		}

		return pageNumbers;
	};

	return (
		<div className="flex justify-center mt-8">
			<nav className="flex items-center space-x-1">
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-3 py-1 rounded-md ${currentPage === 1
							? 'bg-gray-700 text-gray-400 cursor-not-allowed'
							: 'bg-gray-800 text-purple-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
						}`}
				>
					Previous
				</button>

				{renderPageNumbers()}

				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-3 py-1 rounded-md ${currentPage === totalPages
							? 'bg-gray-700 text-gray-400 cursor-not-allowed'
							: 'bg-gray-800 text-purple-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
						}`}
				>
					Next
				</button>
			</nav>
		</div>
	);
};

export default Pagination;