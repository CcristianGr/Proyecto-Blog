import './App.css'
import { Routes, Route } from "react-router-dom";
import { HomePage } from './Pages/Home';
import { LoginPage } from './Pages/Login';

function App() {

  return (
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
      </Routes>
  )
}

export default App
