import { useEffect, useRef, useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

const UserCreationModal = ({ isOpen, onClose, formData, handleInputChange, onContinue }) => {
	const modalRef = useRef(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Handle Escape key press using React's useEffect
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	// No-op if modal is not open
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop overlay */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
				aria-hidden="true"
			/>

			{/* Modal container */}
			<div
				ref={modalRef}
				className="relative w-full max-w-md transform transition-all duration-300 ease-in-out scale-100 opacity-100"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Modal content */}
				<div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl p-6 animate-in fade-in duration-300">
					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
						aria-label="Close modal"
					>
						<X size={20} />
					</button>

					<h3 className="text-xl font-semibold text-white mb-6">Create New User</h3>

					<div className="space-y-5">
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
								autoComplete="name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
								autoComplete="email"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleInputChange}
									className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors pr-10"
									autoComplete="new-password"
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
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors pr-10"
									autoComplete="new-password"
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
						</div>

						<div className="flex space-x-4 pt-2">
							<button
								onClick={onClose}
								className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
							>
								Cancel
							</button>
							<button
								onClick={onContinue}
								className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
							>
								Continue
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

export default UserCreationModal;