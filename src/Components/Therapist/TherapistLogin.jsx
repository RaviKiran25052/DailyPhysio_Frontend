import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const TherapistLogin = ({ onClose }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear error for this field
		if (errors[name]) {
			setErrors({
				...errors,
				[name]: null,
			});
		}
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {};

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid';
		}

		if (!formData.password) {
			newErrors.password = 'Password is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			setLoading(true);
			setError('');

			try {
				const response = await axios.post(
					`${process.env.REACT_APP_API_URL}/therapist/login`,
					formData
				);

				// Store user data in localStorage
				localStorage.setItem('therapistInfo', JSON.stringify(response.data));

				// Close modal and redirect to dashboard
				onClose();
				navigate('/therapist/');
			} catch (error) {
				setError(
					error.response && error.response.data.message
						? error.response.data.message
						: 'Invalid email or password'
				);
			} finally {
				setLoading(false);
			}
		}
	};

	// Prevent click propagation from modal content to modal overlay
	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
			<div className="bg-gray-800 rounded-lg w-full max-w-md p-8" onClick={stopPropagation}>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-white">
						Therapist Login
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white focus:outline-none"
					>
						<FaTimes size={24} />
					</button>
				</div>

				{error && (
					<div className="mb-4 bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className="space-y-6">
						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Email
							</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								className={`w-full px-3 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'
									} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
								placeholder="doctor@example.com"
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-500">{errors.email}</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-medium text-gray-400 mb-1">
								Password
							</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								className={`w-full px-3 py-2 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'
									} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
								placeholder="Enter password"
							/>
							{errors.password && (
								<p className="mt-1 text-sm text-red-500">{errors.password}</p>
							)}
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
								/>
								<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
									Remember me
								</label>
							</div>

							<div className="text-sm">
								<a href="/forgot-password" className="font-medium text-purple-500 hover:text-purple-400">
									Forgot password?
								</a>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={loading}
								className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
									} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
							>
								{loading ? 'Signing in...' : 'Sign in'}
							</button>
						</div>
					</div>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-400">
						Don't have an account?{' '}
						<button
							type="button"
							onClick={() => {
								onClose();
								setTimeout(() => {
									document.querySelector('[data-modal="register"]')?.click();
								}, 100);
							}}
							className="font-medium text-purple-500 hover:text-purple-400"
						>
							Register now
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default TherapistLogin;