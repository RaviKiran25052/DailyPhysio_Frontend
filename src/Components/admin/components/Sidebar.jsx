import React from 'react';
import { Link } from 'react-router-dom';
import {
	FaTachometerAlt,
	FaUsers,
	FaDumbbell,
	FaUserMd,
} from 'react-icons/fa';

const Sidebar = ({ tab, setTab }) => {
	const navItems = [
		{ icon: FaTachometerAlt, name: 'Dashboard', tab: 'main' },
		{ icon: FaUsers, name: 'User Management', tab: 'user' },
		{ icon: FaDumbbell, name: 'Exercise Management', tab: 'exercise' },
		{ icon: FaUserMd, name: 'Therapist Management', tab: 'therapist' },
	];

	return (
		<div className="bg-gray-900 text-white w-64 space-y-6 py-4">
			<div className="px-4">
				<Link to="/admin/home" className="flex items-center space-x-2">
					<span className="text-xl font-extrabold text-purple-500">ExerciseMD</span>
				</Link>
			</div>

			<nav className="flex flex-col px-2">
				{navItems.map((item, index) => (
					<div
						key={index}
						onClick={() => setTab(item.tab)}
						className={`flex items-center space-x-3 px-4 py-3 cursor-pointer rounded-lg transition-colors ${tab === item.tab
							? 'bg-purple-700 text-white'
							: 'text-gray-300 hover:bg-gray-800 hover:text-white'
							}`}
					>
						<item.icon className="text-lg" />
						<span>{item.name}</span>
					</div>
				))}
			</nav>

			<div className="px-4 mt-auto">
				<div className="pt-2 border-t border-gray-700">
					<div className="text-xs text-gray-500">
						<p>© {new Date().getFullYear()} ExerciseMD Admin Dashboard</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;