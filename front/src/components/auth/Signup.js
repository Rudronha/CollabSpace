import React, { useState } from 'react';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signup data:', formData);
    };

    return (
        <div className="auth-container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="auth-btn">Sign Up</button>
            </form>
            <p>Already have an account? <a href="/login">Log In</a></p>
        </div>
    );
};

export default Signup;
