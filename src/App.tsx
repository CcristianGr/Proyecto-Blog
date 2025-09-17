import './App.css'
import { Routes, Route } from 'react-router-dom'; // 👈 1. Importa los componentes
import { HomePage } from './views/Dash/HomePage';
import { LoginForm } from './views/Login/Login';
import { Dashboard } from './views/Dash/DashBoard';
import { RegistrationForm } from './views/Login/Registro';


function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/registration" element={<RegistrationForm />} />
    </Routes>
  )
}

export default App
