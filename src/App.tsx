import './App.css'
import { Routes, Route } from "react-router-dom";
import { LoginPage } from './Pages/Login';
import { RegisterPage } from './Pages/Register';
import { HomePage } from './Pages/Home';

function App() {

  return (
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/Register" element={<RegisterPage/>}/>
        <Route path="/Home" element={<HomePage/>}/>
      </Routes>
  )
}

export default App
