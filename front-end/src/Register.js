import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

const Register = props => {
  const[email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e) => {
      e.preventDefault()

      setError('')
      if(password !== confirmPassword) {
        setError('Passwords do not match')
        return;
      }
      // TODO: implement login logic
  }

  return (
    <>
      <div className="Login-container">
      <h1>Register</h1>

      {error && <p style={{color: 'red'}}>{error}</p>}
      
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

      <button className="Login-button" onClick={handleSubmit}>
          <Link to="/compatibility">Register</Link>
      </button>
  </div>
</>
    )    
}

export default Register;
