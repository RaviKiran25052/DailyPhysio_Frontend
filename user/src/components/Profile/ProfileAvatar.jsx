import React from 'react'

const ProfileAvatar = ({ user, imagePreview, openImageUploadModal }) => {
	return (
		<div className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-gray-800 overflow-hidden group">
			{user.profileImage || imagePreview ? (
				<img
					src={imagePreview || user.profileImage}
					alt={user.fullName}
					className="w-full h-full object-cover"
				/>
			) : (
				<div className="w-full h-full bg-gray-700 flex items-center justify-center">
					<span className="text-3xl text-primary-400 font-bold">
						{user.fullName?.split(' ').map(name => name[0]).join('').toUpperCase()}
					</span>
				</div>
			)}

			{/* Edit Icon Overlay */}
			<button
				onClick={openImageUploadModal}
				className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
					<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
				</svg>
			</button>
		</div>
	);
};

export default ProfileAvatar