import React from 'react';
import { Navigate } from 'react-router-dom';

const TherapistRouteProtect = ({ children }) => {
	const therapistInfo = localStorage.getItem('therapistInfo');
	if (!therapistInfo) {
		return <Navigate to="/therapist" />;
	}
	return children;
};

export default TherapistRouteProtect;