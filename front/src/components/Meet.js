import React, { useContext, useRef, useState, useEffect } from 'react';
import './Meet.css';
import Sidebar from './sidebar';
import Window from './window';
import CodeEditor from './editor';
import useSafeResizeObserver from '../hooks/useSafeResizeObserver';
import { SocketContext } from '../context/socketContext';
import { FaCode } from 'react-icons/fa';

const Meet = () => {
    const [selectedMenu, setSelectedMenu] = useState('Teams');
    const [isVisible, setVisible] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const { code, handleChange, language, handleLanguageChange, handleCompile, output } = useContext(SocketContext);
    const appRef = useRef();

    useSafeResizeObserver(appRef, (entries) => {
        for (let entry of entries) {
            console.log('Window resized:', entry);
        }
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');

        if (token) {
            setTokenValid(true);
        } else {
            alert("Access denied: No token provided.");
        }
    }, []);

    const handleSelect = (menu) => {
        setSelectedMenu(menu);
        setVisible(true);
    };

    const handleCloseWindow = () => {
        setVisible(false);
    };

    const langChange = (event)=>{
        handleLanguageChange(event.target.value)
    }

    return (
        <div>
            {tokenValid ? (
                <div className="meet-container" ref={appRef}>
                    <Sidebar onSelect={handleSelect} />
                    <div className="main-section">
                        <div className='header-nav'>
                            <FaCode />
                            <select className='lang-option' value={language} onChange={langChange}>
                                <option value="C">C</option>
                                <option value="C++">C++</option>
                                <option value="javascript">Javascript</option>
                            </select>
                        </div>
                        <div className="editor-container">
                            <CodeEditor 
                                language={language} 
                                value={code} 
                                onChange={(newCode) => handleChange(newCode)} 
                            />
                            <div className="output-section">
                                <div className="output-header">
                                    <div className="output-title">Output</div>
                                    <button className="run-button" onClick={handleCompile}>Run</button>
                                </div>
                                <pre className="output-box">{output}</pre>
                            </div>
                        </div>
                    </div>
                    {isVisible && <Window selectedMenu={selectedMenu} onClose={handleCloseWindow} />}
                </div>
            ) : (
                <div className="access-error">Access denied: Invalid token.</div>
            )}
        </div>
    );
};

export default Meet;
