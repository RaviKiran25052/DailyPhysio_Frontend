import React from 'react'
import { FaUserPlus, FaClipboardList, FaDumbbell, FaCrown } from 'react-icons/fa';

const FeaturedSection = ({ onLogin, onRegister }) => {
	return (
		<div className="space-y-12">
			{/* Hero Section */}
			<div className="bg-gray-800 rounded-lg p-8 mb-8">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Elevate Your Physiotherapy Practice with ExerciseMD</h1>
					<p className="text-gray-300 text-lg mb-8">Streamline patient care, manage consultations, and deliver personalized treatment plans all in one platform.</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={onLogin}
							className="px-6 py-3 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white font-medium"
						>
							Log In
						</button>
						<button
							onClick={onRegister}
							className="px-6 py-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-white font-medium"
						>
							Sign Up
						</button>
					</div>
				</div>
			</div>

			{/* Features Section - Updated to match actual functionality */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-gray-800 p-6 rounded-lg">
					<div className="text-purple-500 mb-4">
						<FaUserPlus size={28} />
					</div>
					<h3 className="text-xl font-semibold text-white mb-2">Patient Consultations</h3>
					<p className="text-gray-400">Create personalized consultations for patients and manage their treatment journey.</p>
				</div>

				<div className="bg-gray-800 p-6 rounded-lg">
					<div className="text-purple-500 mb-4">
						<FaClipboardList size={28} />
					</div>
					<h3 className="text-xl font-semibold text-white mb-2">Exercise Assignment</h3>
					<p className="text-gray-400">Prescribe specific exercises tailored to each patient's rehabilitation needs.</p>
				</div>

				<div className="bg-gray-800 p-6 rounded-lg">
					<div className="text-purple-500 mb-4">
						<FaDumbbell size={28} />
					</div>
					<h3 className="text-xl font-semibold text-white mb-2">Exercise Access Control</h3>
					<p className="text-gray-400">Manage which exercises patients can access based on their treatment plan.</p>
				</div>

				<div className="bg-gray-800 p-6 rounded-lg">
					<div className="text-purple-500 mb-4">
						<FaCrown size={28} />
					</div>
					<h3 className="text-xl font-semibold text-white mb-2">Premium Exercises</h3>
					<p className="text-gray-400">Unlock advanced exercise routines for patients with specific rehabilitation needs.</p>
				</div>
			</div>

			{/* Testimonial Section */}
			<div className="bg-gray-800 p-8 rounded-lg">
				<div className="max-w-3xl mx-auto text-center">
					<div className="text-purple-400 mb-4">
						<svg className="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
						</svg>
					</div>
					<p className="text-xl text-gray-300 italic mb-6">ExerciseMD has transformed my practice. The ability to assign specific exercises to patients and control their access has improved recovery times and increased patient satisfaction.</p>
					<div className="font-medium text-white">Dr. Sarah Johnson</div>
					<div className="text-sm text-gray-400">Physical Therapist, Seattle Rehabilitation Center</div>
				</div>
			</div>
		</div>
	);
}

export default FeaturedSection