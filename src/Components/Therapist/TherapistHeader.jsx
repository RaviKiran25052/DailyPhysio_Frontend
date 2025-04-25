import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import TherapistLogin from './TherapistLogin';
import TherapistRegister from './TherapistRegister';

const TherapistHeader = () => {
	const navigate = useNavigate();
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);

	// Get therapist info from localStorage
	const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo') || '{}');
	const isLoggedIn = !!localStorage.getItem('therapistInfo');

	const handleLogout = () => {
		localStorage.removeItem('therapistInfo');
		navigate('/therapist/');
		setShowDropdown(false);
	};

	const toggleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	return (
		<header className="bg-gray-800 shadow-md">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<div onClick={() => navigate('/')} className="cursor-pointer">
					<h1 className="text-2xl font-bold text-white">PhysioConnect</h1>
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
								<div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
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
								onClick={() => setShowLoginModal(true)}
								className="px-4 py-2 text-sm text-white hover:text-purple-400 focus:outline-none"
							>
								Log in
							</button>
							<button
								onClick={() => setShowRegisterModal(true)}
								className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
							>
								Register
							</button>
						</div>
					)}
				</div>
			</div>

			{showLoginModal && <TherapistLogin onClose={() => setShowLoginModal(false)} />}
			{showRegisterModal && <TherapistRegister onClose={() => setShowRegisterModal(false)} />}
		</header>
	);
};

export default TherapistHeader;