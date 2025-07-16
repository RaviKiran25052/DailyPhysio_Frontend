import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Adminlogin from './components/Adminlogin'
import AdminHome from './pages/AdminHome'
import AdminExerciseList from './pages/AdminExerciseList'
import UserManagement from './pages/UserManagement'
import TherapistManagement from './pages/TherapistManagement'

const App = () => {
  return (
    <Router>
      <ToastContainer position='top-center' theme='dark' pauseOnHover={false} />
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/login" element={<Adminlogin />} />
        <Route path="/exercises" element={<AdminExerciseList />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/therapists" element={<TherapistManagement />} />
      </Routes>
    </Router>
  )
}

export default App;