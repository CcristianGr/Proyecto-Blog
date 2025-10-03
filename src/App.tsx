import './App.css';
import { Routes, Route } from "react-router-dom";
import {LoginPage} from './Pages/Login';
import {RegisterPage} from './Pages/Register';
import { Home } from './Pages/Home';
// Esto no se toca ome
function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
  );
}

export default App;
