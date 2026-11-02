
import { useState } from "react";
import axios from 'axios'
import { GoogleLogin } from "@react-oauth/google";
import { replace, useNavigate, } from "react-router-dom";
import { Link } from "react-router-dom";
  const  Signup =() => {
  const[username,setUserName] = useState('')
  const[email,setEmail] = useState('')
  const[phone,setPhone] = useState('')
  const[password,setPassword] = useState('')
  const[confirmPassword,setConfirmPassword] = useState('')
  const[errors,setErrors] = useState({})
  const[loading,setLoading] = useState(false)
  const[succes,setSuccess] = useState(false)
  const[message,setMessage] = useState("")
  const[showOTP,setShowOTP] = useState(false)
  const[otp,setOTP] = useState("")
  const[showPassword,setShoePassword] = useState(false)
  const handletoggle = ()=>{
    setShoePassword((prev)=>!prev)
  }
 
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
      newErrors.username="Mininum 3 character required"
    }else if(!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(username))
      newErrors.username = "Username must be letter only"
      
    // Email Required
    if(!email.trim()){
      newErrors.email = "Email is required"
    }else if(
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ){
      newErrors.email = "Enter a valid Email"
    }
    // Phone Validate
    if(!phone.trim()){
      newErrors.phone = "Phone number is required"
    }else if(!/^[6-9]\d{9}/.test(phone)){
      newErrors.phone = "Enter a valid 10-digit phone number"
    }

    //password

    if(!password){
      newErrors.password="Password required"
    }else if(password.length<8){
      newErrors.password = "Password must be at least 8 character"
    }else if(!/[A-Z]/.test(password)){
      newErrors.password = "Add at least one UpperCase letter"
    }else if(!/[a-z]/.test(password)){
      newErrors.password = "Add at least one LowerCase letter"
    }else if(!/\d/.test(password)){
      newErrors.password = "Add at least one number"
    }else if(!/[^A-Za-z0-9]/.test(password)){
      newErrors.password = "Add at least one special character"
    }
    if(!confirmPassword){
      newErrors.confirmPassword = "Confrim Your Psssword"
    }else if(password !== confirmPassword){
      newErrors.confirmPassword = "Password do not Match"
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length ===0
  };
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setErrors({});
  setShowOTP(false);

  // Stop here if frontend validation fails
  if (!validateForm()) {
    return;
  }

  const UserData = {
    username: username.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password,
    confirm_password: confirmPassword,
  };

  setLoading(true);

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/user/auth/signup/",
      UserData
    );

    // Only successful backend responses reach this code
    setMessage(response.data.message || "OTP sent successfully.");
    setShowOTP(true);
    setSuccess(true);
  } catch (error) {
    const data = error.response?.data;

    console.log("Backend status:", error.response?.status);
    console.log("Backend error response:", data);

    if (data?.errors && typeof data.errors === "object") {
      const backendErrors = {};

      Object.entries(data.errors).forEach(([field, value]) => {
        // Django uses confirm_password; React uses confirmPassword
        const frontendField =
          field === "confirm_password" ? "confirmPassword" : field;

        backendErrors[frontendField] = Array.isArray(value)
          ? value.join(" ")
          : typeof value === "string"
            ? value
            : JSON.stringify(value);
      });

      setErrors(backendErrors);
    } else if (data && typeof data === "object") {
      // Handle Django responses such as {"email": ["Invalid email"]}
      const backendErrors = {};

      ["username", "email", "phone", "password", "confirm_password",
        "confirmPassword"].forEach((field) => {
        if (data[field]) {
          const frontendField =
            field === "confirm_password" ? "confirmPassword" : field;
          const value = data[field];

          backendErrors[frontendField] = Array.isArray(value)
            ? value.join(" ")
            : String(value);
        }
      });

      if (Object.keys(backendErrors).length > 0) {
        setErrors(backendErrors);
      } else {
        setMessage(
          data.error || data.detail || data.message ||
          "Signup failed. Please check your details."
        );
      }
    } else {
      setMessage("Unable to connect to the server. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  // verify otp 
  const verifyOTP = async (e) => {
  e.preventDefault();
  setMessage("");

  if (!/^\d{6}$/.test(otp)) {
    setMessage("Please enter a valid 6-digit OTP.");
    return;
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/user/auth/signup/verify-otp/",
      {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      }
    );

    setMessage(response.data.message || "Email verified successfully.");
    window.location.href = "/login",{replace:true};
  } catch (error) {
    console.log("OTP verification error:", error.response?.data);

    const data = error.response?.data;

    setMessage(
      data?.error ||
      data?.message ||
      data?.detail ||
      data?.otp?.[0] ||
      "OTP verification failed. Please try again."
    );
  }
};

  
  return (
    
    <div className="signup-background">
    
    
      <div
        className="card signup-card shadow-lg p-3 bg-dark bg-opacity-75 text-white  rounded"
       
      >
        <Link to="/signup" className="text-decoration-none">
        <h2 className="text-center mb-4 text-light ">Create Account</h2>
        </Link>
        {!showOTP ? ( 
        <form onSubmit={handleSubmit}>

         
          <div className=" mb-3">
            <label className="form-label m-1">Username</label>
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid":""}`}
              
              value={username}
              onChange={(ev)=>setUserName(ev.target.value)}
              
            />
            {errors.username &&(
            <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              
              className={`form-control ${errors.email ? "is-invalid":""}`}
              
              value={email}
              onChange={(ev)=>setEmail(ev.target.value)}
              
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="from-label">Phone Number</label>
            <input type="text" className={`form-control ${errors.phone ? "is-invalid":""}`} value={phone} onChange={(ev)=>setPhone(ev.target.value)}  />
            {errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
          </div>
          
            
          {/* Password */}
          
          <div className="mb-3">
            <label className="form-label">Set Password</label>
            <input
              type={showPassword ? 'text':'password'}
              name="password"
              className={`password-input form-control ${errors.password ? "is-invalid":""}`}
              
              value={password}
              onChange={(ev)=>setPassword(ev.target.value)}
              
            />
            <button type="button" className="password-toggle-signup" onClick={handletoggle} aria-label={showPassword ? "Hide password":"Show password"}>
              <i className={showPassword ? 'bi bi-eye-slash':'bi bi-eye'}></i>
            </button>
            {errors.password && (
              <p className="invalid-feedback">{errors.password}</p>
            )}
          
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="form-label">Confirm Password</label>
            <input
              type={showPassword ?  'text':'password'}
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? "is-invalid":""}`}
              
              value={confirmPassword}
              onChange={(ev)=>setConfirmPassword(ev.target.value)}
            
            />
            
            {errors.confirmPassword && (
              <p className="invalid-feedback">{errors.confirmPassword}</p>
            )}
          </div>
          {message && (
            <div className="alert alert-info" role="alert">
              {message}
            </div>
          )}

          {/* Signup Button */}
          <button 
            type="submit"
            className="btn btn-danger  w-100 d-flex justify-content-center  "
            disabled={loading}
            
           
          >
            {loading ? "Please wait":"Sign Up"}
          </button>

        </form>
        ):(
          <form onSubmit={verifyOTP} className="mt-4">
            <h4>Verify Your Email</h4>
            <p>Enter the 6-digit OTP sent to {email}</p>
            <input className="form-control mb-3" value={otp} onChange={(ev)=>setOTP(ev.target.value)} placeholder="Enter OTP" maxLength={6} inputMode="numeric" pattern="[0-9]{6}" />
            <button className="btn btn-success d-flex mx-auto" type="submit" > Verify OTP</button>
          </form>
        )}
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
          <Link to="/login" className="text-danger text-decoration-none" >
            Login
          </Link>
        </p>
        
    </div>

    </div>

  );
}

export default Signup;
