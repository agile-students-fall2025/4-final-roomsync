import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

const Login = props => {
    const[email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // TODO: implement login logic
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