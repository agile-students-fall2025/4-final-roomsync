import { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import './Login.css'
import { loginUser, getCurrentUser} from './api/users'

const Login = props => {
    const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const result = await loginUser(email, password)
      
      if (result.success) {
        
        const currentUser = getCurrentUser()
        
        if (currentUser) {
          navigate('/create')
        } 
        else {
          navigate('/landing')
        }

      } else {
        setError(result.message || 'Login failed. Please check your credentials.')
        console.log('Login failed:', result.message)
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
}

    return (
        <>
            <div className="Login-container">
                <h1>Login</h1>

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
                    type="password" 
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="Login-button" onClick={handleSubmit}>
                    Login
                </button>
                <p className="register-text">
                    Don't have an account? <Link to="/register">Register</Link> here.
                </p>
            </div>
        </>
    )
}

export default Login;