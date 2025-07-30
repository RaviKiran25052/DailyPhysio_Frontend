import React from 'react'

// Membership Information Component
const MembershipInformation = ({ user, formatDate }) => {
	const membershipType = user.membership?.type || 'free';
	const isPaid = membershipType === 'monthly' || membershipType === 'yearly';

	const formatMembershipType = (type) => {
		switch (type) {
			case 'monthly':
				return 'Monthly Pro';
			case 'yearly':
				return 'Yearly Pro';
			default:
				return 'Free';
		}
	};

	return (
		<div className="bg-primary-800 p-4 rounded-lg">
			<h3 className="text-primary-400 font-medium mb-2">Membership</h3>
			<div className="flex items-center mb-3">
				<div className={`p-2 rounded-md mr-2 ${isPaid ? 'bg-primary-600' : 'bg-gray-600'}`}>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
					</svg>
				</div>
				<div>
					<p className="text-white font-medium">
						{formatMembershipType(membershipType)}
					</p>
					{isPaid && user.membership?.paymentDate && (
						<p className="text-gray-300 text-sm">
							Last payment: {formatDate(user.membership?.paymentDate)}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default MembershipInformation