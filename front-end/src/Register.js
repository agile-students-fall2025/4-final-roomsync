import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { registerUser, getUserByEmail } from './api/users'

const Register = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false)
      return;
    }

    if (email.length < 5) {
      setError('Please enter a valid email');
      setLoading(false)
      return;
    }

    if (getUserByEmail(email)){
      setError('This user already registered')
      setLoading(false)
      return;
    }

    if (!name.trim()) {
      setError('Name is required');
      setLoading(false)
      return;
    }


    const registerStatus = registerUser(name, email, password)

    if (registerStatus !== false){
      navigate('/')
    }
    else{
      console.log('Failed registration')
    }

    
  }

  return (
    <>
      <div className="Login-container">
      <h1>Register</h1>

      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <label className="Login-label">Full Name</label>
        <input 
          className="Login-input" 
          placeholder="name"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="Login-label">Email</label>
        <input 
          className="Login-input" 
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="Login-label">Password</label>
        <input 
          className="Login-input" 
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="Login-label">Confirm Password</label>
        <input 
          className="Login-input" 
          placeholder="Type your password again"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="Login-button">
            Register
        </button>
      </form>
  </div>
</>
    )    
}

export default Register;
