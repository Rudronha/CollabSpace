import React from 'react';
import './MainNavbar.css';
import { FaFreebsd } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MainNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <FaFreebsd className="logo" />
                <h1 className="brand-name">ColabSpace</h1>
            </div>

            <div className="auth">
                {/* <Link to="/signup" className="btn sign-up">Sign Up</Link>
                <Link to="/login" className="btn log-in">Log In</Link> */}
            </div>
        </nav>
    );
};

export default MainNavbar;
