import './App.css';
import { Routes, Route } from "react-router-dom";
import {LoginPage} from './Pages/Login';
import {RegisterPage} from './Pages/Register';
import { Home } from './Pages/Home';
import { UserProfile } from './Pages/UserProfile';
// Esto no se toca ome
function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Profile" element={<UserProfile />} />
      </Routes>
  );
}

export default App;
