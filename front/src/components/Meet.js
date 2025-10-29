import { useContext, useRef, useState, useEffect } from 'react';
import './Meet.css';
import Sidebar from './sidebar';
import CodeEditor from './editor';
import useSafeResizeObserver from '../hooks/useSafeResizeObserver';
import { SocketContext } from '../context/socketContext';
import { FaCode } from 'react-icons/fa';

const Meet = () => {
    const [tokenValid, setTokenValid] = useState(false);
    const [token, setToken] = useState('');
    const [copied, setCopied] = useState(false);
    const { code, handleChange, language, handleLanguageChange, handleCompile, output } = useContext(SocketContext);
    const appRef = useRef();

    useSafeResizeObserver(appRef, (entries) => {
        for (let entry of entries) {
            console.log('Window resized:', entry);
        }
    });

    // --- Output Resizing ---
    const [outputHeight, setOutputHeight] = useState(200);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = () => setIsResizing(true);

    const handleMouseMove = (e) => {
        if (!isResizing) return;
        e.preventDefault(); // prevents text selection
        const newHeight = window.innerHeight - e.clientY;
        if (newHeight > 100 && newHeight < window.innerHeight - 200) setOutputHeight(newHeight);
    };

    const handleMouseUp = () => setIsResizing(false);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isResizing]);
    // ------------------------

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const tokenParam = queryParams.get('room');

        if (tokenParam) {
            setToken(tokenParam);
            setTokenValid(true);
        } else {
            alert("Access denied: No token provided.");
        }
    }, []);

    const langChange = (event) => {
        handleLanguageChange(event.target.value);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            {tokenValid ? (
                <div className="meet-container" ref={appRef}>
                    <Sidebar />
                    <div className="main-section">
                        <div className="header-nav">
                            <div className="nav-left">
                                <FaCode className="logo" />
                                <select className="lang-option" value={language} onChange={langChange}>
                                    <option value="C">C</option>
                                    <option value="C++">C++</option>
                                    <option value="javascript">Javascript</option>
                                </select>
                            </div>

                            <div className="share-code">
                                Room ID: <span className="token-text">{token}</span>
                                <button className="copy-btn" onClick={copyToClipboard}>
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </div>

                        <div className="editor-container">
                            <CodeEditor
                                language={language}
                                value={code}
                                onChange={(newCode) => handleChange(newCode)}
                            />

                            <div
                                className="output-section"
                            >
                                <div className="output-header" onMouseDown={handleMouseDown}>
                                    <div className="output-title">Output</div>
                                    <button className="run-button" onClick={handleCompile}>Run</button>
                                </div>

                                <pre className="output-box" style={{ height: `${outputHeight}px` }}> {output}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="access-error">Access denied: Invalid token.</div>
            )}
        </div>
    );
};

export default Meet;
