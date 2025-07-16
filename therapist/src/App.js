import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TherapistDashboard from './pages/TherapistDashboard'
import TherapistHome from './pages/TherapistHome'
import ExerciseDetailPage from './pages/ExerciseDetailPage'
import CreatorExercisesPage from './pages/CreatorExercisesPage'

const App = () => {
  return (
    <Router>
      <ToastContainer position='top-center' theme='dark' pauseOnHover={false} />
      <Routes>
        <Route path="/" element={<TherapistDashboard />} />
        <Route path="/home" element={<TherapistHome />} />
        <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
        <Route path="/creator/exercise/:creatorId" element={<CreatorExercisesPage />} />
      </Routes>
    </Router>
  )
}

export default App;