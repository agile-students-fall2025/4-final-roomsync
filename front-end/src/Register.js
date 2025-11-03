import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const Register = props => {
  const[email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
      e.preventDefault()

      setError('')
      if(password !== confirmPassword) {
        setError('Passwords do not match')
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (email.length < 5) {
        setError('Not valid email input');
        return;
      }
      
      navigate('/create');
  }

  return (
    <>
      <div className="Login-container">
      <h1>Register</h1>

      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
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
