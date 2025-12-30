import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/user.service'
import { toast } from 'react-toastify'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mobile, setMobile] = useState('')
    const navigate = useNavigate()

    const signup = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const mobileRegex = /^[0-9]{10}$/

        if (name === '')
            toast.warn('name must be entered')
        else if (email === '')
            toast.warn('email must be entered')
        else if (!emailRegex.test(email))
            toast.error('Invalid email format')
        else if (password === '')
            toast.warn('password must be entered')
        else if (mobile === '')
            toast.warn('mobile must be entered')
        else if (!mobileRegex.test(mobile))
            toast.error('Mobile number must be exactly 10 digits')
        else {
            const result = await registerUser(name, email, password, mobile)

            if (result.status === 'success') {
                toast.success('User registered successfully')
                navigate('/')
            } else {
                toast.error(result.error)
            }
        }
    }

    // New Function to handle Enter Key
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            signup()
        }
    }

    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card p-4 shadow w-50">
                <h2 className="text-center mb-4">Register</h2>

                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter name"
                        onChange={e => setName(e.target.value)}
                        onKeyUp={handleEnter}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={e => setEmail(e.target.value)}
                        onKeyUp={handleEnter}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={e => setPassword(e.target.value)}
                        onKeyUp={handleEnter}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter mobile number"
                        onChange={e => setMobile(e.target.value)}
                        onKeyUp={handleEnter}
                    />
                </div>

                <button className="btn btn-success w-100" onClick={signup}>
                    Sign Up
                </button>

                <div className="mt-3 text-center">
                    Already have an account? <Link to="/">Click Here</Link>
                </div>
            </div>
        </div>
    )
}

export default Register