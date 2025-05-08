import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TherapistHeader from './TherapistHeader';
import FeaturedSection from './FeaturedSection';
import TherapistLogin from './TherapistLogin';
import TherapistRegister from './TherapistRegister';
import AccountNotActivatedModal from './AccountNotActivatedModal';
import RegistrationSuccessModal from './RegistrationSuccessModal';

const TherapistDashboard = () => {
	const navigate = useNavigate();
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [showNotActivatedModal, setShowNotActivatedModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('therapistInfo')) {
			const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo'));
			if (therapistInfo.status === 'active') {
				navigate('/therapist/home')
			}
		}
	}, []);

	const toggleAuthModals = () => {
		setShowLoginModal(!showLoginModal);
		setShowRegisterModal(!showRegisterModal);
	}

	const handleLoginClose = (isVerfied, isSubmitted) => {
		setShowLoginModal(false);

		if (isVerfied) {
			navigate('/therapist/home');
		} else if (isSubmitted) {
			setShowNotActivatedModal(true);
		}
	}

	const handleRegisterClose = (isSuccess) => {
		setShowRegisterModal(false);
		if (isSuccess) {
			setShowSuccessModal(true);
		}
	}

	const handleNotActivatedClose = () => {
		setShowNotActivatedModal(false);
		setShowLoginModal(true);
	}

	const handleSuccessModalClose = () => {
		setShowSuccessModal(false);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<TherapistHeader
				onLogin={() => setShowLoginModal(true)}
				onRegister={() => setShowRegisterModal(true)}
			/>

			<main className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">
						Welcome to ExerciseMD
					</h1>
				</div>

				<FeaturedSection onLogin={() => setShowLoginModal(true)} onRegister={() => setShowRegisterModal(true)} />
			</main>

			{/* Footer */}
			<footer className="bg-gray-800 border-t border-gray-700 py-6 mt-12">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center mb-4 md:mb-0">
							<svg className="w-6 h-6 text-purple-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M17 2L12 7L7 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M12 7V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span className="text-white font-medium">ExerciseMD</span>
						</div>
						<div className="text-gray-400 text-sm">
							© 2025 ExerciseMD. All rights reserved.
						</div>
					</div>
				</div>
			</footer>

			{showLoginModal && <TherapistLogin onClose={handleLoginClose} onRegister={toggleAuthModals} />}
			{showRegisterModal && <TherapistRegister onClose={handleRegisterClose} onLogin={toggleAuthModals} />}
			{showNotActivatedModal && <AccountNotActivatedModal onLgin={handleNotActivatedClose} onClose={() => setShowNotActivatedModal(false)} />}
			{showSuccessModal && <RegistrationSuccessModal onClose={handleSuccessModalClose} />}
		</div>
	);
};

export default TherapistDashboard;