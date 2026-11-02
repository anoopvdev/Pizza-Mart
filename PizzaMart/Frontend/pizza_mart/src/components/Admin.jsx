import React, { useState } from 'react'
import { Link } from 'react-router-dom';
const Admin = () => {
    const[email,seteEmail]=useState("");
    const[password,setPassword]=useState("")
    const[showPassword,setShowPassword] = useState(false)
    const[error,setError] = useState("")
  return (
    <>
      <div className='mb-2'>
                    <input type="text" className='form-control' placeholder='username' value={email} onChange={(ev)=>seteEmail(ev.target.value)} />

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
    </>
  )
}

export default Admin
