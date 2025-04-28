import React from 'react'
import ModalBackdrop from './ModalBackdrop';

const ImageUploadModal = ({ isOpen, onClose, onSubmit, imagePreview, setImagePreview, setSelectedImage }) => {
	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setSelectedImage(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	if (!isOpen) return null;

	return (
		<ModalBackdrop onClose={onClose}>
			<h2 className="text-xl font-bold text-white mb-4">Update Profile Picture</h2>
			<form onSubmit={onSubmit} className="space-y-4">
				<div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6 bg-gray-700">
					{imagePreview ? (
						<div className="relative w-32 h-32 mb-4">
							<img
								src={imagePreview}
								alt="Preview"
								className="w-full h-full object-cover rounded-full"
							/>
							<button
								type="button"
								onClick={() => {
									setImagePreview(null);
									setSelectedImage(null);
								}}
								className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</button>
						</div>
					) : (
						<>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p className="text-gray-300 mb-2">Drag and drop your image here or click to browse</p>
						</>
					)}
					<input
						type="file"
						id="image"
						name="image"
						accept="image/*"
						onChange={handleImageChange}
						className={`w-full ${imagePreview ? 'hidden' : 'block'}`}
					/>
				</div>

				<div className="flex justify-end space-x-3 pt-2">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={!imagePreview}
						className={`px-4 py-2 rounded transition ${imagePreview ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
					>
						Upload Image
					</button>
				</div>
			</form>
		</ModalBackdrop>
	);
};

export default ImageUploadModal