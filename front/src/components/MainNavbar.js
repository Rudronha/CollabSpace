import React from 'react';
import './MainNavbar.css';
import { FaFreebsd } from 'react-icons/fa';
const MainNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <FaFreebsd className='logo'/>
                 {/* Replace 'logo.png' with your logo file path <img src="logo.png" alt="Site Logo" className="logo" /> */}
                <h1>ColabSpace</h1>
            </div>
        </nav>
    );
};

export default MainNavbar;
