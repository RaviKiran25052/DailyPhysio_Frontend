import React from 'react';
import { FaBars, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Header = ({ adminInfo, handleLogout, toggleSidebar }) => {
	return (
		<header className="bg-gray-900 shadow-sm z-10">
			<div className="flex items-center justify-between px-4 py-3">
				<button
					onClick={toggleSidebar}
					className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:bg-gray-100"
				>
					<FaBars className="h-5 w-5" />
				</button>

				<div className="flex-1 md:flex-none">
					<h1 className="text-lg font-semibold md:hidden text-purple-600">DailyPhysio</h1>
				</div>

				<div className="flex items-center space-x-4">
					{/* Profile dropdown */}
					<div className="relative">
						<div className="flex items-center space-x-3">
							<div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
								<FaUser className="h-4 w-4" />
							</div>
							<div className="flex flex-col text-right text-sm">
								<span className="font-medium text-white">
									{adminInfo ? adminInfo.fullName : 'Admin User'}
								</span>
								<span className="text-xs text-gray-500">Administrator</span>
							</div>
							<button
								onClick={handleLogout}
								className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
							>
								<FaSignOutAlt className="mr-2" />
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;