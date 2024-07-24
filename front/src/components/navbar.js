import './navbar.css'
import React from 'react';
import { FaCode } from 'react-icons/fa';
function Navbar({language,setLanguage}){

    const handleChange = (event) => {
        setLanguage(event.target.value);
    };
    
    return(
        <div className='navbar'>
            <FaCode />
            <select className='lang-option' value={language} onChange={handleChange}>
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="javascript">Javascript</option>
            </select>
        </div>
    );
}

export default Navbar;