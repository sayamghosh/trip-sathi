import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Placeholder routes for future implementation */}
        <Route path="/guides" element={<div className='p-20 text-center text-2xl'>Guides Page (Coming Soon)</div>} />
        <Route path="/about" element={<div className='p-20 text-center text-2xl'>About Us (Coming Soon)</div>} />
        <Route path="/contact" element={<div className='p-20 text-center text-2xl'>Contact Page (Coming Soon)</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<div className='p-20 text-center text-2xl'>Signup Page (Coming Soon)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
