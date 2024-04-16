import { Routes, Route } from 'react-router-dom'
import Home from "../src/pages/Home"
import Register from "../src/pages/Register"
import Login from "../src/pages/Login"
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import { UserContextProvider } from '../context/userContext'
import Dashboard from './pages/Dashboard/Dashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './ResetPassword'
import Verify from './pages/verify'



axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {


  return (
    <UserContextProvider>

      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/verification/:id/:token" element={<Verify />} />
      </Routes>

    </UserContextProvider>
  )
}

export default App
