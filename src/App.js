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
import TherapistHome from './Components/Therapist/TherapistHome';
import CreatorExercisesPage from './Pages/CreatorExercisesPage';

// Wrapper component to check current route
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isTherapist = location.pathname.startsWith('/therapist') || location.state?.isTherapist;
  
  return (
    <>
      <ToastContainer position='top-center' theme='dark' pauseOnHover={false} />
      {(!isAdminPage && !isTherapist) && <Navbar />}
      <main className={`flex flex-col ${(!isAdminPage && !isTherapist) ? 'mt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/creator/exercise/:creatorId" element={<CreatorExercisesPage />} />

          <Route path="/therapist/" element={<TherapistDashboard />} />
          <Route path="/therapist/home" element={<TherapistHome />} />
          
          <Route path="/admin/login" element={<Adminlogin />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/exercises" element={<AdminExerciseList />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/therapists" element={<TherapistManagement />} />
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