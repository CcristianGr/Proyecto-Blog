import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {LoginPage} from './Pages/Login';
import {RegisterPage} from './Pages/Register';
import Home from './Pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
