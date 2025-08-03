import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import CreatorExercisesPage from './pages/CreatorExercisesPage';
import ConsultationDetails from './pages/ConsultationDetails';
import ConsultedExerciseView from './pages/ConsultedExerciseView';

const MainLayout = () => (
  <>
    <Navbar />
    <main className="mt-16">
      <Outlet />
    </main>
  </>
);

const App = () => {
  return (
    <Router>
      <ToastContainer position='top-center' theme='dark' pauseOnHover={false} />
      <Routes>
        {/* Route without Navbar */}
        <Route path="/consultation/:id" element={<ConsultationDetails />} />
        <Route path="/consultation/exercise/:id" element={<ConsultedExerciseView />} />

        {/* All routes with Navbar inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
          <Route path="/creator/exercise/:creatorId" element={<CreatorExercisesPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;