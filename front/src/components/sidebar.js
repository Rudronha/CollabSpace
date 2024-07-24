import React , {useState}from 'react';
import { FaBell, FaComments, FaUsers , FaPlus, FaSignOutAlt, FaFreebsd, FaPhoneAlt } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ onSelect }) => {
    const [selectedMenu, setSelectedMenu] = useState('Teams');
    const handleSelect = (menu) => {
        setSelectedMenu(menu);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header" >
                <div className="teams-icon">
                <FaFreebsd />
                </div>
            </div>
            <ul className="sidebar-menu">
                <li 
                    className={selectedMenu === 'users' ? 'active' : ''} 
                    onClick={() => {onSelect('Teams'); handleSelect('users')}}
                ><FaUsers /></li>
                <li 
                    className={selectedMenu === 'chats' ? 'active' : ''} 
                    onClick={() =>{ onSelect('Chat');handleSelect('chats') }}
                ><FaComments /></li>
                <li 
                    className={selectedMenu === 'mice' ? 'active' : ''} 
                    onClick={() => {onSelect('Call');handleSelect('mice')}}
                ><FaPhoneAlt/></li>
                <li 
                    className={selectedMenu === 'activity' ? 'active' : ''} 
                    onClick={() => {onSelect('Activity');handleSelect('activity')}}
                ><FaBell /></li>
                <li 
                    className={selectedMenu === 'logout' ? 'active' : ''} 
                    onClick={() => {handleSelect('logout')}}
                ><FaSignOutAlt /></li>
                <li 
                    className={selectedMenu === 'apps' ? 'active' : ''} 
                    onClick={() =>{ onSelect('Apps');handleSelect('apps')}}
                ><FaPlus /></li>
            </ul>
        </div>
    );
};

export default Sidebar;
