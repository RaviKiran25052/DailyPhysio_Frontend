import React from 'react'

const ModalBackdrop = ({ children, onClose }) => (
	<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div className="relative bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
			<button
				onClick={onClose}
				className="absolute top-3 right-3 text-gray-400 hover:text-white"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			{children}
		</div>
	</div>
);

export default ModalBackdrop