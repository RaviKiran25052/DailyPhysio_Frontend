import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const TherapistLogin = ({ onClose, onRegister }) => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		otp: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	
	// Add forgot password state
	const [forgotPassword, setForgotPassword] = useState(false);
	const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
	// Add state for password visibility
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

		// Standard login validation
		if (!forgotPassword) {
			if (!formData.email.trim()) {
				newErrors.email = 'Email is required';
			} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
				newErrors.email = 'Email is invalid';
			}

			if (!formData.password) {
				newErrors.password = 'Password is required';
			}
		} 
		// Password reset validation (step 3)
		else if (forgotPassword && resetStep === 3) {
			if (!formData.password) {
				newErrors.password = 'Password is required';
			}
			
			if (formData.password !== formData.confirmPassword) {
				newErrors.confirmPassword = 'Passwords do not match';
			}
			
			if (formData.password && formData.password.length < 6) {
				newErrors.password = 'Password must be at least 6 characters';
			}
		}
		// OTP validation (step 2)
		else if (forgotPassword && resetStep === 2) {
			if (!formData.otp) {
				newErrors.otp = 'OTP is required';
			} else if (formData.otp.length !== 4 || !/^\d+$/.test(formData.otp)) {
				newErrors.otp = 'OTP must be 4 digits';
			}
		}
		// Email validation (step 1)
		else if (forgotPassword && resetStep === 1) {
			if (!formData.email.trim()) {
				newErrors.email = 'Email is required';
			} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
				newErrors.email = 'Email is invalid';
			}
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
				// Handle forgot password flow
				if (forgotPassword) {
					if (resetStep === 1) {
						// Step 1: Send email for OTP
						const response = await axios.post(
							`${process.env.REACT_APP_API_URL}/therapist/forgot-password`,
							{ email: formData.email }
						);
						
						if (response.status === 200) {
							toast.success('OTP sent to your email', {
								position: "top-center"
							});
							setResetStep(2);
						}
					} 
					else if (resetStep === 2) {
						// Step 2: Verify OTP
						const response = await axios.post(
							`${process.env.REACT_APP_API_URL}/therapist/verify-otp`,
							{ 
								email: formData.email,
								otp: formData.otp
							}
						);
						
						if (response.status === 200) {
							toast.success('OTP verified successfully', {
								position: "top-center"
							});
							setResetStep(3);
						}
					}
					else if (resetStep === 3) {
						// Step 3: Reset Password
						const response = await axios.post(
							`${process.env.REACT_APP_API_URL}/therapist/reset-password`,
							{
								email: formData.email,
								password: formData.password,
								confirmPassword: formData.confirmPassword
							}
						);
						
						if (response.status === 200) {
							toast.success('Password reset successful', {
								position: "top-center"
							});
							setForgotPassword(false);
							setResetStep(1);
							setFormData({
								...formData,
								password: '',
								confirmPassword: '',
								otp: '',
							});
						}
					}
				} else {
					// Original login logic
					const response = await axios.post(
						`${process.env.REACT_APP_API_URL}/therapist/login`,
						formData
					);
					console.log(response.data.status);
					
					onClose(response.data.status, true);
					if (response.data.status === 'active') {
						localStorage.setItem('therapistInfo', JSON.stringify(response.data));
						navigate('/therapist/home');
					}
				}
			} catch (error) {
				setError(
					error.response && error.response.data.message
						? error.response.data.message
						: forgotPassword 
							? 'Failed to process request'
							: 'Invalid email or password'
				);
			} finally {
				setLoading(false);
			}
		}
	};

	// Handle forgot password button click
	const handleForgotPassword = () => {
		setForgotPassword(true);
		setResetStep(1);
		setError('');
	};

	// Back button for multi-step forgot password flow
	const handleBackStep = () => {
		if (resetStep > 1) {
			setResetStep(resetStep - 1);
		} else {
			setForgotPassword(false);
		}
		setError('');
	};

	// Prevent click propagation from modal content to modal overlay
	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	// Determine the title based on the current step
	let title = 'Therapist Login';
	if (forgotPassword) {
		if (resetStep === 1) {
			title = 'Reset Password';
		} else if (resetStep === 2) {
			title = 'Enter OTP';
		} else {
			title = 'Create New Password';
		}
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => onClose(false, false)}>
			<div className="bg-gray-800 rounded-lg w-full max-w-md p-8" onClick={stopPropagation}>
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-white">
						{title}
					</h2>
					<button
						onClick={() => onClose(false, false)}
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
						{/* Email Field - shown in login and forgot password step 1 */}
						{(!forgotPassword || resetStep === 1) && (
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
						)}

						{/* OTP Field - only shown in forgot password step 2 */}
						{forgotPassword && resetStep === 2 && (
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Verification Code
								</label>
								<input
									type="text"
									name="otp"
									value={formData.otp}
									onChange={handleChange}
									maxLength="4"
									className={`w-full px-3 py-2 bg-gray-700 border ${errors.otp ? 'border-red-500' : 'border-gray-600'
										} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 tracking-widest text-center text-lg`}
									placeholder="Enter 4-digit code"
								/>
								{errors.otp && (
									<p className="mt-1 text-sm text-red-500">{errors.otp}</p>
								)}
							</div>
						)}

						{/* Password Field - shown in login and forgot password step 3 */}
						{(!forgotPassword || resetStep === 3) && (
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									{forgotPassword ? 'New Password' : 'Password'}
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										value={formData.password}
										onChange={handleChange}
										className={`w-full px-3 py-2 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'
											} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
										placeholder={forgotPassword ? "Create new password" : "Enter password"}
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
										onClick={() => setShowPassword(!showPassword)}
										aria-label={showPassword ? "Hide password" : "Show password"}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								{errors.password && (
									<p className="mt-1 text-sm text-red-500">{errors.password}</p>
								)}
							</div>
						)}

						{/* Confirm Password Field - only shown in forgot password step 3 */}
						{forgotPassword && resetStep === 3 && (
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-1">
									Confirm Password
								</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleChange}
										className={`w-full px-3 py-2 bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
											} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500`}
										placeholder="Confirm new password"
									/>
									<button
										type="button"
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
									>
										{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								{errors.confirmPassword && (
									<p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
								)}
							</div>
						)}

						{/* Remember me & Forgot password - only shown in login */}
						{!forgotPassword && (
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
									<button 
										type="button"
										onClick={handleForgotPassword}
										className="font-medium text-purple-500 hover:text-purple-400"
									>
										Forgot password?
									</button>
								</div>
							</div>
						)}

						{/* Back button for forgot password flow */}
						{forgotPassword && (
							<div className="text-center mb-4">
								<button
									type="button"
									onClick={handleBackStep}
									className="text-purple-400 hover:text-purple-300 text-sm font-medium"
								>
									{resetStep > 1 ? 'Back to previous step' : 'Back to Login'}
								</button>
							</div>
						)}

						<div>
							<button
								type="submit"
								disabled={loading}
								className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
									} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
							>
								{loading ? 'Processing...' : 
									forgotPassword ? 
										(resetStep === 1 ? 'Send Verification Code' : 
										 resetStep === 2 ? 'Verify Code' : 
										 'Reset Password') : 
										'Sign in'}
							</button>
						</div>
					</div>
				</form>

				{/* Registration link - only shown in login */}
				{!forgotPassword && (
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-400">
							Don't have an account?{' '}
							<button
								type="button"
								onClick={onRegister}
								className="font-medium text-purple-500 hover:text-purple-400"
							>
								Register now
							</button>
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TherapistLogin;