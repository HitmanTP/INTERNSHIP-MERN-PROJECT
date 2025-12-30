import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/user.service'
import { toast } from 'react-toastify'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const signin = async () => {
        if (email === '') toast.warn('Email must be entered')
        else if (password === '') toast.warn('Password must be entered')
        else {
            const result = await loginUser(email, password)
            if (result.status === 'success') {
                sessionStorage.setItem('token', result.data.token)
                sessionStorage.setItem('role', result.data.role)
                sessionStorage.setItem('userName', result.data.name)
                sessionStorage.setItem('mobile', result.data.mobile)
                sessionStorage.setItem('email', email)
                toast.success('Login successful')
               if (result.data.role === 'admin') navigate('/admin-dashboard')
               else navigate('/home')
            } else {
                toast.error(result.error)
            }
        }
    }

    // New Function to handle Enter Key
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            signin()
        }
    }

    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-5 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Welcome Back</h2>
                    <p className="text-muted">Login to Course Mania</p>
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Enter email"
                        onChange={e => setEmail(e.target.value)}
                        onKeyUp={handleEnter} 
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Enter password"
                        onChange={e => setPassword(e.target.value)}
                        onKeyUp={handleEnter} 
                    />
                </div>

                <button className="btn btn-primary w-100 btn-lg mb-3 rounded-pill" onClick={signin}>
                    Sign In
                </button>

                <div className="text-center">
                    <span className="text-muted">Don't have an account? </span> 
                    <Link to="/register" className="text-decoration-none fw-bold text-info">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}

export default Login