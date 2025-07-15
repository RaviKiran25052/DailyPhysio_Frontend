import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import UserProfilePage from './pages/UserProfilePage';
import CreatorExercisesPage from './pages/CreatorExercisesPage';

const App = () => {
  return (
    <Router>
      <ToastContainer position='top-center' theme='dark' pauseOnHover={false} />
      <Navbar />
      <main className='mt-16'>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
          <Route path="/creator/exercise/:creatorId" element={<CreatorExercisesPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App;