
// import { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// const ForgottPassword = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
  
//   const navigate = useNavigate()
//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     await axios.post(
//       "http://127.0.0.1:8000/api/user/auth/forgot-password/",
//       { email }
//     );

//     navigate("/verify-reset-otp", {
//       state: { email: email }
//     });
//   } catch (error) {
//     console.log(error.response?.data);
//     setError(error.response?.data || "Verify your email")
//   }
// };

//   return (

//     <div className="forgot-page  ">
//       <div className="forgot-card shadow-lg p-3 bg-dark bg-opacity-75 text-white rounded ">
//         <Link to="/login" className="forgot-back text-light">
//           <i className="bi bi-arrow-left"></i> Back to Login
//         </Link>

//         <div className="forgot-icon">
//           <i className="bi bi-shield-lock"></i>
//         </div>

//         <h2 className="text-light">Forgot Password?</h2>

//         <p className="forgot-description text-light">
//           Don't worry! Enter your registered email address.
//           We'll help you reset your password.
//         </p>

//         {message && (
//           <p className="alert alert-success" role="status">
//             {message}
//           </p>
//         )}

//         {error && (
//           <p className="alert alert-danger" role="alert">
//             {error}
//           </p>
//         )}
//         {/* {!showOTP ?( */}
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="email" className="form-label text-light">
//             Email Address
//           </label>

//           <div className="forgot-input-wrapper " >
//             <i className="bi bi-envelope"></i>
//             <input
//               id="email"
//               type="email"
//               className="form-control"
//               placeholder="Enter your registered email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
              
//             />
//             {error && (
//             <p className="alert alert-danger" role="alert">{error}</p>
//           )}
//           </div>
          

//           <button
//             type="submit"
//             className="btn btn-danger w-100 forgot-submit"
//             disabled={loading} 
//           >
//             {loading ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   aria-hidden="true"
//                 ></span>
//                 Sending...
//               </>
//             ) : (
//               "Send Reset Instructions"
//             )}
//           </button>
//         </form>
        
//         <div className="forgot-footer text-light">
//           Remember your password? <Link to="/login">Login</Link>
//         </div>

        
//       </div>
//     </div>
//   );
// }

// export default ForgottPassword



import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/auth/forgot-password/",
        { email: email.trim() }
      );

      // Redirect only after a successful API response
      navigate("/verify-reset-otp", {
        state: { email: email.trim() },
      });
    } catch (err) {
      console.log("Forgot password error:", err.response?.data);

      const data = err.response?.data;

      let errorMessage = "Unable to send OTP. Please try again.";

      if (typeof data === "string") {
        errorMessage = data;
      } else if (data && typeof data === "object") {
        if (typeof data.email === "string") {
          errorMessage = data.email;
        } else if (Array.isArray(data.email)) {
          errorMessage = data.email.join(" ");
        } else if (typeof data.error === "string") {
          errorMessage = data.error;
        } else if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (typeof data.message === "string") {
          errorMessage = data.message;
        } else if (data.errors && typeof data.errors === "object") {
          errorMessage = Object.values(data.errors)
            .flat()
            .filter((item) => typeof item === "string")
            .join(" ");
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card shadow-lg p-3 bg-dark bg-opacity-75 text-white rounded">

        <Link to="/login" className="forgot-back text-light">
          <i className="bi bi-arrow-left"></i> Back to Login
        </Link>

        <div className="forgot-icon">
          <i className="bi bi-shield-lock"></i>
        </div>

        <h2 className="text-light">Forgot Password?</h2>

        <p className="forgot-description text-light">
          Don't worry! Enter your registered email address.
          We'll help you reset your password.
        </p>

        {/* Display error message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Display success message, if needed */}
        {message && (
          <div className="alert alert-success" role="status">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="form-label text-light">
            Email Address
          </label>

          <div className="forgot-input-wrapper">
            <i className="bi bi-envelope"></i>

            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${error ? "is-invalid" : ""}`}
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-danger w-100 forgot-submit mt-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
        </form>

        <div className="forgot-footer text-light">
          Remember your password? <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;


