import {FaFreebsd } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {

    return (
        <div className="sidebar">
            <div className="sidebar-header" >
                <div className="teams-icon">
                <FaFreebsd />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
