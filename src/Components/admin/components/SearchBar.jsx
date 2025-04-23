import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, onSearchChange }) => {
	return (
		<div className="relative w-full sm:w-64 md:w-96 mb-4 sm:mb-0">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<FaSearch className="text-gray-400" />
			</div>
			<input
				type="text"
				placeholder="Search by name, category, position..."
				value={searchTerm}
				onChange={(e) => onSearchChange(e.target.value)}
				className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-800 border border-gray-700 text-purple-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
			/>
		</div>
	);
};

export default SearchBar;