import React from 'react'
import './App.css'
import Signup from './components/SignupPage'
import LoginPage from './components/LoginPage'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Link } from "react-router-dom";
import UserProfile from './components/UserProfile'
import ForgottPassword from './components/ForgottPassword'
import PasswordChange from './components/PasswordChange'
import OTPVerification from './components/OTPVerification'
import VerifyResetOTP from './components/OTPVerification'
import Menu from './components/Menu'
import Home from './components/Home'
import LandingPage from './components/Landing'
import Cart from './components/Cart'
import { ProfileProvider } from './context/ProfileContext'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'
import Logout from './components/Logot'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <ProfileProvider>
    <Routes>
      
      <Route path='/' element={<LandingPage />} />
      <Route path='/home' element={<Home />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/profile' element={<UserProfile />} />
      <Route path='/forgotpassword' element={<ForgottPassword />} />
      <Route path='/change-password' element={<PasswordChange />} />
      <Route path='/verify-reset-otp' element ={<VerifyResetOTP />} />
      <Route path='/menu'element ={<Menu />} />
      <Route path='/about' element={<About />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/contact' element ={<Contact />} />
      <Route path='/logout' element = {<Logout />} />
      <Route path='/admin' element={<Admin />} />
      
    </Routes>
    </ProfileProvider>  
    </BrowserRouter>
      
    </>
  )
}

export default App
