import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';

const TherapistHeader = ({ onLogin, onRegister }) => {
	const navigate = useNavigate();
	const [showDropdown, setShowDropdown] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Get therapist info from localStorage
	const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo') || '{}');

	useEffect(() => {
		if (therapistInfo && therapistInfo.status === 'active') {
			setIsLoggedIn(true);
		} else {
			setIsLoggedIn(false);
		}
	}, [therapistInfo]);

	const handleLogout = () => {
		localStorage.clear();
		setShowDropdown(false);
		window.location.reload();
	};

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	return (
		<header className="bg-gray-800 shadow-md">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<div onClick={() => navigate('/')} className="cursor-pointer">
					<h1 className="text-2xl font-bold text-white">ExerciseMD</h1>
				</div>

				<div className="flex items-center">
					{isLoggedIn ? (
						<div className="relative">
							<button
								onClick={toggleDropdown}
								className="flex items-center space-x-2 text-white hover:text-purple-400 focus:outline-none"
							>
								<FaUser className="text-purple-500" />
								<span className="hidden md:inline-block">{therapistInfo.name}</span>
								{showDropdown ? <FaTimes size={12} /> : <FaBars size={12} />}
							</button>

							{showDropdown && (
								<div className="absolute right-0 mt-2 w-fit bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
									<div className="p-3 border-b border-gray-700">
										<p className="font-medium text-white">{therapistInfo.name}</p>
										<p className="text-sm text-gray-400">{therapistInfo.email}</p>
									</div>
									<a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</a>
									<a href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</a>
									<button
										onClick={handleLogout}
										className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
									>
										Sign out
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="space-x-2">
							<button
								onClick={onLogin}
								className="px-4 py-2 text-sm text-white hover:text-purple-400 focus:outline-none"
							>
								Log in
							</button>
							<button
								onClick={onRegister}
								className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
							>
								Register
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default TherapistHeader;