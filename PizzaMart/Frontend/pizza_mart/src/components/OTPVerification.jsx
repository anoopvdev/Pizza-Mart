
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function VerifyResetOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const[error,setError] = useState("")
  const[message,setMessage] = useState("")
  const[loading,setLoading] = useState(false)

  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const resendhandle = async()=>{
    setError("");
    setLoading(true)
    setMessage("")
    try{
      const response = await axios.post("http://127.0.0.1:8000/api/user/auth/resend-reset-otp/",{email});
      setMessage(response.data.message || "Please check your email for the new OTP.");
      setOtp("")
    }catch(error){
      error.response?.data?.error || "Unable to resend OTP. Please try again."

    }finally{
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if(!otp || otp.length !==6){
      setError("Please Enter the valid 6-digit OTP.");
      return;
    }if(!email){
      setError("Email is missing. Please try forgot password again.");
      return;
    }
    setLoading(true)

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/auth/verify-reset-otp/",
        {
          email: email,
          otp: otp
        }
      );

      setMessage(response.data.message || "OTP verified successfully.")
      

      
      navigate("/change-password", {
        state: {
          email: email,
          resetToken: response.data.reset_token
        }
      });
    } catch (error) {
  const data = error.response?.data;
      const errorMessage = 
      data?.error||
      data?.detail ||
      data?.message ||
      (typeof data === "string" ? data : null) ||
      "OTP verification failed. Please enter the correct OTP. "
      setError(typeof errorMessage === "string" ? errorMessage : "Invalide or expire OTP. please try again.")
    }finally{
      setLoading(false)
    }
  };

  return (
    
   <div className=" otp-page  ">
    <div className="otp-card shadow-lg p-3 bg-dark bg-opacity-75 text-white rounded"  >        
    <h2 className="text-center">Verify OTP</h2>
      <p className="text-center">Enter the OTP sent to your registered email address.</p>
        <form onSubmit={handleVerify}> 
          <div className="otp" data-bs-otp>        
        <input
           type="text"
           className="form-control mb-2 "
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
               setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
             }
             maxLength={6}
             aria-label="Verification code"
             
           />
           
        </div>
          <Link className="text-danger text-decoration-none d-flex justify-content-end mb-2 p-1" onClick={resendhandle } >Resend otp</Link>
          
       {error &&(
          <div className="alert alert-danger py-2" role="alert">{error}</div>
          )}
          {message &&(
            <div className="alert alert-success py-2" role="status">{message}</div>
          )}
           <button type="submit" className="btn btn-success w-100" disabled={loading}>
             {loading ? "Verifying...":"Verify OTP"}
           </button>
         </form>
       </div>
    </div>
  );
}

export default VerifyResetOTP;
