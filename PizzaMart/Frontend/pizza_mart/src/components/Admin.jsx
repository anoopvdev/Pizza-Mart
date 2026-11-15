
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminApi from '../admin/adminApi';

const Admin = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setError("");
    setLoading(true);

    try {

      // Admin Login API
      const response = await adminApi.post('login/', {
        email: email.trim(),
        password: password,
      });
      localStorage.setItem("adminAccess",response.data.access)
      localStorage.setItem("adminRefresh",response.data.refresh)

      

   
      navigate('/admin/dashboard');

    } catch (error) {

      console.error("Admin Login Error:", error.response?.data || error);

      setError(
        error.response?.data?.detail ||
        error.response?.data?.error ||
        error.message ||
        "Admin login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='login-background'>

        <div className='card login-card shadow-lg p-3 bg-dark bg-opacity-75 text-white rounded'>

          <h2 className='text-center mb-4'>Login Admin</h2>

          <form onSubmit={handleSubmit}>

            <div className='mb-2'>

              <input
                type="email"
                className='form-control'
                placeholder='Email address'
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />

            </div>

            <div className="mb-4">

              <div className='text-end mb-1'>

                <Link
                  to="/forgotpassword"
                  className='text-danger text-decoration-none text-center'
                >
                  Forgot password?
                </Link>

              </div>

              <div className='password-wrapper'>

                <input
                  type={showPassword ? 'text' : 'password'}
                  className='form-control password-input'
                  placeholder='Password'
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                />

                <div className='mb-3'>

                  <div className='position-relative'>

                    <button
                      type='button'
                      className='password-toggle'
                      onClick={handleToggle}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      <i
                        className={
                          showPassword
                            ? 'bi bi-eye-slash'
                            : 'bi bi-eye'
                        }
                      ></i>

                    </button>

                  </div>

                </div>

              </div>

            </div>

            {error && (
              <p className='alert alert-danger' role='alert'>
                {error}
              </p>
            )}

            <div className='d-flex justify-content-center'>

              <button
                type='submit'
                className='btn btn-danger w-100'
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
};

export default Admin;
