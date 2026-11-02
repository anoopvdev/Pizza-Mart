import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import adminApi from '../admin/adminApi';
const Admin = () => {
  const navigate = useNavigate();
    const[email,seteEmail]=useState("");
    const[password,setPassword]=useState("")
    const[showPassword,setShowPassword] = useState(false)
    const[error,setError] = useState("")
    const[loading,setLoading] = useState(false)
  const handleToggle = () =>{
      setShowPassword((prev)=>!prev)
    }
    const handleSubmit = async (ev)=>{
      ev.preventDefault();
      setError("")
      setLoading(true)
      try{
        const response = await adminApi.post('login/',{
          email,
          password,
        });
        localStorage.setItem('admin_access',response.data.access);
        navigate('/admin/dashboard')
      }catch(error){
        setError(error.response?.data.error || "Admin login faild. Please try again")
      }finally{
        setLoading(false)
      }
      
    }
  return (
    <>
      <div className='login-background'>
        <div className='card login-card shadow-lg p-3 bg-dark bg-opacity-75 text-white  rounded'>
            <h2 className='text-center mb-4 '>Login Admin </h2>
            <form >
                <div className='mb-2'>
                    <input type="text" className='form-control' placeholder='Email address' value={email} onChange={(ev)=>seteEmail(ev.target.value)} />

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
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                </div>
                {error && (
                  <p className='alert alert-danger' role='alert'>{error}</p>
                )}
                
                <div className='d-flex justify-content-center'>
                    <button type='submit' className='btn btn-danger w-100'> Login </button>
                    
                </div>
                
        </form>
        </div>|
      </div>
    </>
  )
}

export default Admin
