
import { useState } from "react";
import axios from 'axios'
import { GoogleLogin } from "@react-oauth/google";
const  Signup =() => {
  const[username,setUserName] = useState('')
  const[email,setEmail] = useState('')
  const[phone,setPhone] = useState('')
  const[password,setPassword] = useState('')
  const[confirmPassword,setConfirmPassword] = useState('')
  const[error,setError] = useState({})
  const[loading,setLoading] = useState(false)
  const[succes,setSuccess] = useState(false)
  const handleGoogleSuccess = (credentialResponse) =>{
    console.log("Google login Successful")
    console.log(credentialResponse.credential)
  }
  // Username Validate

  const validateForm = () =>{
    const newErrors = {}

    //username Validate
    if(!username.trim()){
      newErrors.username = "Username is Required"
    }else if(username.trim().length<3){
      newErrors.username("Mininum 3 character required")
    }
    // Email Required
    if(!email.trim()){
      newErrors.email = "Email is required"
    }else if(
      !/^[^\s@]+@[\s@]+\.[^\s@]+$/.test(email)
    ){
      newErrors.email = "Enter a valid Email"
    }
    // Phone Validate
    if(!phone.trim()){
      newErrors.phone = "Phone number is required"
    }else if(!/^\+?[0-9]{10,15}$/.test(phone)){
      newErrors.phone = "Enter a valid Phone Number"
    }

    //password

    if(!password){
      newErrors.password="Password required"
    }else if(password.length<8){
      newErrors.password = "Password must be at least 8 character"
    }
    // confrim password

    if(!confirmPassword){
      newErrors.confirmPassword = "Confrim Your Psssword"
    }else if(password !== confirmPassword){
      newErrors.confirmPassword = "Password do not Match"
    }
      
   
  }
  const handleSubmit = async (e) => {
      e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

      const UserData = {
        username,
        email,
        phone,
        password,
        confirmPassword:confirmPassword
    };
    setLoading(true)

    try{
      const response = await axios.post("http://127.0.0.1:8000/api/user/auth/signup/",UserData)
      console.log("responseData==>>",response.data)
      console.log("Registration succesful")
      setError({})
      setSuccess(true)

    }catch(error){
        console.log("Status : ",error.response?.status)
        console.log(error.response?.data)
        setError(error.response?.data || {
          general : "Unable to connect to the server"
        })
    }finally{
      setLoading(false)
    }
    
  };
  
  return (
    
    <div className="signup-background">
    
    
      <div
        className="card signup-card shadow-lg p-3 bg-dark bg-opacity-75 text-white  rounded"
       
      >

        <h2 className="text-center mb-4">Create Account</h2>

        <form onSubmit={handleSubmit}>

         
          <div className=" mb-3">
            <label className="form-label m-1">Username</label>
            <input
              type="text"
              name="username"
              className="form-control "
              
              value={username}
              onChange={(ev)=>setUserName(ev.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              
              value={email}
              onChange={(ev)=>setEmail(ev.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="from-label">Phone Number</label>
            <input type="text" className="form-control" value={phone} onChange={(ev)=>setPhone(ev.target.value)} required />
            
          </div>
            
          {/* Password */}
          
          <div className="mb-3">
            <label className="form-label">Set Password</label>
            <input
              type="password"
              name="password"
              className="form-control "
              
              value={password}
              onChange={(ev)=>setPassword(ev.target.value)}
              required
            />
          
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              
              value={confirmPassword}
              onChange={(ev)=>setConfirmPassword(ev.target.value)}
              required
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="btn btn-danger  w-100 d-flex justify-content-center  "
          >
            Sign Up
          </button>

        </form>
        <div className="text-center m-3">OR</div>
        <div className="d-flex justify-content-center">
          <GoogleLogin 
          onSuccess={handleGoogleSuccess}
          onError={()=>console.log("Google sign failed")}
          text="signup_with"
          shape="rectangular" />
        
        </div>
        <p className="text-center mt-3 ">
          Already have an account?{" "}
          <a href="/login" className="text-danger">
            Login
          </a>
        </p>



      
    
    </div>
    </div>
  );
}

export default Signup;
