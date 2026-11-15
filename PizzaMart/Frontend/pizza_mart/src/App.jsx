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
import UserManagement from './components/UserManagement'
import AdminDashboard from './components/Dashboard'
import OrderManagement from './components/OrderManagement'
import AdminLayout from './components/AdminLayout'
import ProductManagement from './components/ProductManagement'
import CouponManagement from './components/CouponsManagement'
import CategoryManagement from './components/CategoryManagement'
import Checkout from './components/Checkout'
import OrderSuccess from './components/Ordersuccess'
import MyOrders from './components/MyOrders'
import MyAddresses from './components/MyAddress'
import AdminContactEnquiries from './components/AdminContactMessage'
import PasswordChangeEmail from './components/PasswordChangeGmail'
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
      <Route path='/admin/login' element={<Admin />} />
      <Route path='/checkout' element={<Checkout />} />
      <Route path='/order-success/:orderNumber' element={<OrderSuccess />} />
      <Route path='/my-order' element={<MyOrders />} />
      <Route path='/my-address' element={<MyAddresses />} />
      <Route path='/email-change-password' element ={<PasswordChangeEmail />} />


      
      <Route path='/admin' element={<AdminLayout />}>
      <Route path='dashboard' element={<AdminDashboard /> }/>
      <Route path='users' element={<UserManagement />} />
      <Route path='products' element={<ProductManagement />} />
      <Route path='orders' element={<OrderManagement />} />
      <Route path='coupons' element={<CouponManagement />} />
      <Route path='categorys' element={<CategoryManagement />} />
      <Route path='contact-message' element={<AdminContactEnquiries />} />
      </Route>
    </Routes>
    </ProfileProvider>  
    </BrowserRouter>
      
    </>
  )
}

export default App
