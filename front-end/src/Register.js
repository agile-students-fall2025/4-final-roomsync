// Register.js - UPDATED VERSION
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import { registerUser, getCurrentUser } from './api/users'

const Register = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('') 
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
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

    if (!username.trim()) {
      setError('Username is required');
      setLoading(false)
      return;
    }

    if (username.length < 3) {
      setError('Username is must be at leat 3 character');
      setLoading(false)
      return;
    }

      const result = await registerUser(username, email, password)

      if (result.success) {
        const currentUser = getCurrentUser();

        if (currentUser) {
          console.log('Logged in user:', currentUser)
               
            navigate('/create')
        }
        else {
          navigate('/landing')
        }

        return result
      }
      else {
        setError(result.message || 'Registration failed')
      }
      
      setLoading(false)

      
  
  }

  return (
    <div className="Login-container">
      <h1>Register</h1>

      {error && <p style={{color: 'red'}}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <label className="Login-label">Username</label> 
        <input 
          className="Login-input" 
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
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
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <label className="Login-label">Confirm Password</label>
        <input 
          className="Login-input" 
          type="password"
          placeholder="Type your password again"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button 
          type="submit" 
          className="Login-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        
        <p style={{textAlign: 'center', marginTop: '1rem'}}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  )    
}

export default Register;