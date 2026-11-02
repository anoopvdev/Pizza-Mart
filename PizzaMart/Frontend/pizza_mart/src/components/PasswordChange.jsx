import axios from 'axios'
import React, { useState } from 'react'


const PasswordChange = () => {
 const[newPassword,setnewPassword] = useState("")
 const[confirm_password,setConfirmPassword] = useState("")
 const[error,setError]=useState("")
 const[loading,setLoading] = useState(false)
 const[success,setSuccess] = useState(false)
 const[message,setMessage] = useState("")
 const validatePassword =()=>{
    const newErrors ={}
    if(!newPassword.trim()){
        newErrors.newPassword = "Password is required"
    }else if(newPassword.length<8){
        newErrors.newPassword = "Password must be at least 8 character"
    }else if(!/[A-Z]/.test(newPassword)){
      newErrors.password = "Add at least one UpperCase letter"
    }else if(!/[a-z]/.test(newPassword)){
      newErrors.password = "Add at least one LowerCase letter"
    }else if(!/\d/.test(newPassword)){
      newErrors.password = "Add at least one number"
    }else if(!/[^A-Za-z0-9]/.test(newPassword)){
      newErrors.password = "Add at least one special character"
    }
    if(!confirm_password){
        newErrors.confirm_password = "Confrim Your Password"
    }else if(newPassword != confirm_password){
        newErrors.confirm_password = "Password do not Match."
    }
    setError(newErrors);
    return Object.keys(newErrors).length ===0
 }
const handleSubmit = async (ev) =>{
    ev.preventDefault()
    setLoading(true)
    setSuccess(false)
    try{
        const response = await axios.post("http://127.0.0.1:8000/api/user/auth/reset-password/",{newPassword:newPassword,confirm_password:confirm_password},)
        setMessage(response.data.message || "Password Change Successfully")
        setError("")
        setSuccess(true)
        setLoading(true)
    }catch(error){
        setMessage(error.response?.data?.error || "Change password faild")
        setLoading(false)
    }
 }
  return (
    <>
      <div className='Password-background  ' >
        <div className='card passsword-card shadow-lg p-3 bg-dark bg-opacity-75 text-white rounded '>
            <h2 className=''>Create a New Password</h2>
            <strong className='text-center mb-3'>Rember the password</strong>
            <form onSubmit={handleSubmit} >
                <div className='mb-3'>
                <label className='form-label m-1'>New Password</label>
                <input type="password" className='form-control' value={newPassword} onChange={(ev)=>setnewPassword(ev.target.value)} placeholder='Enter a strong password' />
                {error.newPassword && (
                    <p className='text-danger'>{error.newPassword}</p>
                )}

                </div>
                <div className='mb-3'>
                    <label className='form-label '>Confirm Password</label>
                    <input type="password" className='form-control ' value={confirm_password} onChange={(ev)=>setConfirmPassword(ev.target.value)} placeholder='Re-Enter the password' />
                    {error.confirm_password && (
                        <p className='text-danger'>{error.confirm_password}</p>
                    )}
                </div>
                <button type='submit' onClick={validatePassword} className='btn btn-danger w-100 d-flex justify-content-center mb-3'>Update Password</button>
            </form>

        </div>

      </div>
    </>
  )
}

export default PasswordChange
