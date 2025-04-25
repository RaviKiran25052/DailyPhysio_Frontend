import React from 'react';
import { Navigate } from 'react-router-dom';

const TherapistRouteProtect = ({ children }) => {
  const therapistInfo = JSON.parse(localStorage.getItem('therapistInfo') || '{}');
  if (therapistInfo && therapistInfo.token && therapistInfo.status !== 'active') {
    return <Navigate to="/therapist/" />;
  }
  return children;
};

export default TherapistRouteProtect;