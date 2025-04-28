import React, { useState } from 'react'
import ModalBackdrop from './ModalBackdrop';

const PasswordChangeModal = ({ isOpen, onClose, onSubmit }) => {
	const [passwordData, setPasswordData] = useState({
		current: '',
		new: '',
		confirm: ''
	});

	const handlePasswordChange = (e) => {
		setPasswordData({
			...passwordData,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(passwordData);
		setPasswordData({ current: '', new: '', confirm: '' });
	};

	if (!isOpen) return null;

	return (
		<ModalBackdrop onClose={onClose}>
			<h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="current" className="block text-sm text-gray-300 mb-1">Current Password</label>
					<input
						type="password"
						id="current"
						name="current"
						value={passwordData.current}
						onChange={handlePasswordChange}
						className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
						required
					/>
				</div>
				<div>
					<label htmlFor="new" className="block text-sm text-gray-300 mb-1">New Password</label>
					<input
						type="password"
						id="new"
						name="new"
						value={passwordData.new}
						onChange={handlePasswordChange}
						className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
						required
					/>
				</div>
				<div>
					<label htmlFor="confirm" className="block text-sm text-gray-300 mb-1">Confirm New Password</label>
					<input
						type="password"
						id="confirm"
						name="confirm"
						value={passwordData.confirm}
						onChange={handlePasswordChange}
						className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
						required
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
						className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-500 transition"
					>
						Update Password
					</button>
				</div>
			</form>
		</ModalBackdrop>
	);
};

export default PasswordChangeModal