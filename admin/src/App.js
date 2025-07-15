import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <ToastContainer position='top-center' theme='dark' pauseOnHover={false} />
      <Routes>
        <Route path="/" element={<div className='bg-red-500'>App</div>} />
      </Routes>
    </Router>
  )
}

export default App;