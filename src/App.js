import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ExercisesPage from './Pages/ExercisesPage';
import ExerciseDetailPage from './Pages/ExerciseDetailPage';
import UserProfilePage from './Pages/UserProfilePage';
import Navbar from './Components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './Pages/HomePage';
import Adminlogin from './Components/admin/Adminlogin';
import AdminHome from './Components/admin/AdminHome';
import AdminExerciseList from './Components/admin/AdminExerciseList';
import UserManagement from './Components/admin/UserManagement';
import TherapistManagement from './Components/admin/Therapist/TherapistManagement';
import TherapistDashboard from './Components/Therapist/TherapistDashboard';
import TherapistManagementTable from './Components/admin/Therapist/TherapistManagementTable';
import TherapistConsultation from './Components/Therapist/TherapistConsultation';
import axios from 'axios';
import CreateExercise from './Components/Profile/CreateExercise';
import CreatorExercisesPage from './Pages/CreatorExercisesPage';

const API_URL = process.env.REACT_APP_API_URL;

// Wrapper component to check current route
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isTherapist = location.pathname.startsWith('/therapist');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');

    try {
      const fetchUserData = async () => {
        try {
          const parsedToken = token;
          const response = await axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${parsedToken}` }
          });

          if (response.status === 200) {
            setUserData(response.data);
          }
        } catch (apiError) {
          console.error('Error fetching profile data:', apiError);
        }
      };
      fetchUserData();

    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, []);

  return (
    <>
      <ToastContainer position='top-center' theme='dark' pauseOnHover={false} />
      {(!isAdminPage && !isTherapist) && <Navbar />}
      <main className={`flex flex-col ${(!isAdminPage && !isTherapist) ? 'mt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercise/:id" element={<ExerciseDetailPage userData={userData} />} />
          <Route path="/profile" element={<UserProfilePage userData={userData} />} />
          <Route path="/creator/exercises" element={<CreateExercise />} />
          <Route path="/creator/exercise/:creatorId" element={<CreatorExercisesPage />} />

          {/* <Route element={<TherapistRouteProtect />}> */}
          <Route path="/therapist/" element={<TherapistDashboard />} />
          <Route path="/therapist/new-consultation" element={<TherapistConsultation />} />
          {/* </Route> */}

          <Route path="/admin/login" element={<Adminlogin />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/exercises" element={<AdminExerciseList />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/therapists" element={<TherapistManagement />} />
          <Route path="/admin/therapists/manage" element={<TherapistManagementTable />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;