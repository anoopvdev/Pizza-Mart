import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import ForgottPassword from '../components/ForgottPassword';
import { useCart } from '../context/CartCotext';


const LoginPage = () => {
    const navigate = useNavigate()
    const[username,setUsername] = useState('')
    const[password,setPassword] = useState('')
    const[error,setError] = useState("")
    const[showPassword,setShowPassword] = useState(false)
    const[loading,setLoading] = useState(false)
    const {fetchCart} = useCart();
    const handleToggle = () =>{
      setShowPassword((prev)=>!prev)
    }

    const handleGoogleSuccess = (credentialResponse) =>{
      console.log("Google login Successful")
      console.log(credentialResponse.credential)
    }
    // const handleSubmit = async (ev) =>{
    //   ev.preventDefault();
    //   setError("")
    //   setLoading(true)

    //   try{
    //     const response = await axios.post("http://127.0.0.1:8000/api/user/auth/login/",
    //       {
    //         username:username.trim(),
    //         password:password
    //       }
    //     );
    //     console.log(response.data)
    //     // const accessToken = response.data.access;
    //     // if(accessToken){
    //     //   localStorage.setItem("accessToken",accessToken)
    //     // }
    //     localStorage.setItem("access",response.data.access)
    //     localStorage.setItem("refresh",response.data.refresh)
    //     navigate("/home")
        
    //   }catch(error){
    //     const message = error.response?.data?.error
    //     setError(message || "Login failed")
    //   }finally{
    //     setLoading(false)
    //   }
    
    // }
    const handleSubmit = async (ev) => {
  ev.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/user/auth/login/",
      {
        username: username.trim(),
        password: password
      }
    );

    console.log("Login response:", response.data);

    // Save JWT tokens
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    // Fetch the logged-in user's cart
    await fetchCart();

    // Navigate after cart fetching
    navigate("/home");

  } catch (error) {
    console.log("Login error:", error.response?.data);

    const message = error.response?.data?.error;
    setError(message || "Login failed");

  } finally {
    setLoading(false);
  }
};
    
    

  return (
    <>
    <nav className='navbar navbar-light bg-dark '>
      <div className='container'>
        <img  alt="pizzaimage" />
        <Link to="/signup" className='text-decoration-none '>
        <button className='btn btn-outline-danger justify-content-center'>Signup</button>
        </Link>
      </div>
    </nav>
      <div className='login-background'>
        <div className='card login-card shadow-lg p-3 bg-dark bg-opacity-75 text-white  rounded'>
            <h2 className='text-center mb-4 '>Login User</h2>
            <form onSubmit={handleSubmit}>
                <div className='mb-2'>
                    <input type="text" className='form-control' placeholder='username' value={username} onChange={(ev)=>setUsername(ev.target.value)} />

                </div>
                
                <div className="mb-4">
                    <div className='text-end mb-1'>
                    <Link to="/forgotpassword"  className='text-danger text-decoration-none text-center'> forgott password?</Link>
                </div>
                  <div className='password-wrapper'>
                <input type={showPassword ?  'text': 'password'} className='form-control password-input ' placeholder='Password' value={password} onChange={(ev)=>setPassword(ev.target.value)} />
                <div className='mb-3'>
                <div className='position-relative'>
                <button type='button'  className='password-toggle ' onClick={handleToggle} aria-label={showPassword ? 'Hide password':'Show password'}>
                  <i className={showPassword ? 'bi bi-eye-slash':'bi bi-eye '}></i>
                </button>
                </div>
                </div>
                </div>
                </div>
                {error && (
                  <p className='alert alert-danger' role='alert'>{error}</p>
                )}
                
                <div className='d-flex justify-content-center'>
                    <button type='submit' className='btn btn-danger w-100'> Login </button>
                    
                </div>
                
                <div className="text-center m-3">OR</div>
                <div className="d-flex justify-content-center ">
            <GoogleLogin 
             onSuccess={handleGoogleSuccess}
          onError={()=>console.log("Google sign failed")}
          text="signup_with"
          shape="rectangular" />
        
        </div>
        </form>
        </div>|
      </div>
    </>
  )
}

export default LoginPage
