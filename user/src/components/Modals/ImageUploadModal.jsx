import React, { useRef, useState } from 'react';
import { FaTimes, FaCloudUploadAlt, FaImage } from 'react-icons/fa';

const ImageUploadModal = ({
	isOpen,
	imagePreview: initialImagePreview,
	onClose,
	onSubmit,
	loading
}) => {
	const [error, setError] = useState('');
	const fileInputRef = useRef(null);
	const [imagePreview, setImagePreview] = useState(initialImagePreview);
	const [selectedFile, setSelectedFile] = useState(null);

	const handleImageChange = (e) => {
		// Reset previous errors
		setError('');

		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			// File type validation
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
			if (!allowedTypes.includes(file.type)) {
				setError('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.');
				return;
			}

			// File size validation (5MB limit)
			const maxSize = 5 * 1024 * 1024; // 5MB
			if (file.size > maxSize) {
				setError('File size should be less than 5MB.');
				return;
			}

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				// Additional image dimension validation
				const img = new Image();
				img.onload = () => {
					// Optional: Validate image dimensions
					if (img.width < 200 || img.height < 200) {
						setError('Image must be at least 200x200 pixels.');
						return;
					}
					setImagePreview(reader.result);
					setSelectedFile(file);
				};
				img.src = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();

		// Reset previous errors
		setError('');

		const files = e.dataTransfer.files;
		if (files && files[0]) {
			fileInputRef.current.files = files;
			handleImageChange({ target: fileInputRef.current });
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current.click();
	};

	const clearImage = () => {
		setImagePreview(null);
		setSelectedFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		setError('');
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!selectedFile) {
			setError('Please select an image to upload.');
			return;
		}

		// Create FormData to send file
		const formData = new FormData();
		formData.append('image', selectedFile);
		onSubmit(formData);
		
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			onClick={onClose}
		>
			<div
				className="relative bg-primary-800 rounded-xl shadow-xl max-w-md w-full p-6"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none"
					aria-label="Close"
				>
					<FaTimes className="h-6 w-6" />
				</button>

				<h2 className="text-xl font-bold text-white mb-4">Update Profile Picture</h2>

				{/* Error Message */}
				{error && (
					<div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div
						className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 bg-primary-700/60 cursor-pointer hover:border-primary-500 transition"
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onClick={triggerFileInput}
					>
						{/* File Input */}
						<input
							type="file"
							ref={fileInputRef}
							id="image"
							name="image"
							accept="image/jpeg,image/png,image/gif,image/webp"
							onChange={handleImageChange}
							className="hidden"
							aria-label="Upload image"
						/>

						{/* Image Preview or Placeholder */}
						{imagePreview ? (
							<div className="relative w-32 h-32 mb-4">
								<img
									src={imagePreview}
									alt="Preview"
									className="w-full h-full object-cover rounded-full border-2 border-primary-600"
								/>
								<button
									type="button"
									onClick={clearImage}
									className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition"
									aria-label="Remove image"
								>
									<FaTimes className="h-4 w-4" />
								</button>
							</div>
						) : (
							<div className="flex flex-col items-center">
								<FaCloudUploadAlt className="h-12 w-12 text-primary-400 mb-2" />
								<p className="text-gray-300 mb-2 text-center">
									Drag and drop your image here
									<br />or
									<span className="text-primary-400 ml-1 hover:underline">
										click to browse
									</span>
								</p>
								<FaImage className="h-8 w-8 text-gray-500" />
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex justify-end space-x-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!imagePreview}
							className={`px-4 py-2 rounded flex items-center transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${imagePreview
								? 'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500'
								: 'bg-gray-600 text-gray-400 cursor-not-allowed'
								}`}
						>
							{loading ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Uploading...
								</>
							) : 'Upload Image'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ImageUploadModal;