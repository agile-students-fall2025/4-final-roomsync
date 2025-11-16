import { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import './Login.css'
import { loginUser } from './api/users'

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

    const loginRes = loginUser(email , password);

    if(loginRes !== false){
        navigate('/')
    }
    else{
        console.log('Wrong email or password');
    }
}

    return (
        <>
            <div className="Login-container">
                <h1>Login</h1>

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