import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Adminlogin from './components/Adminlogin'
import AdminHome from './pages/AdminHome'
import TherapistDetail from './pages/TherapistDetail';
import ExerciseDetailPage from './pages/ExerciseDetailPage';

const App = () => {
  return (
    <Router>
      <ToastContainer position='top-center' theme='dark' pauseOnHover={false} />
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/login" element={<Adminlogin />} />
        <Route path="/therapists/:id" element={<TherapistDetail />} />
        <Route path="/exercise/:id" element={<ExerciseDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App;