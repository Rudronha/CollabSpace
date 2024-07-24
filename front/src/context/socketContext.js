import React, { useState, useEffect, useRef, createContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [userId, setUserId] = useState(null);
  const socketRef = useRef();

  useEffect(() => {
    // Connect to Socket.io server
    socketRef.current = io(process.env.REACT_APP_API_URL);
    socketRef.current.on('connect', () => {
      setUserId(socketRef.current.id);  // Set the user ID to the socket ID
      console.log('Connected to server');
    });

    // Handle incoming text changes
    socketRef.current.on('text change', (newText) => {
      setCode(newText);
    });

    // Handle incoming language changes
    socketRef.current.on('language change', (newLanguage) => {
      setLanguage(newLanguage);
    });

    // Handle incoming compile results
    socketRef.current.on('compile result', (result) => {
      setOutput(result.output);
    });

    // Handle incoming chat messages
    socketRef.current.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    //Clean up Socket.io connection on unmount
        return () => {
        socketRef.current.disconnect();
        };
    }, []);

    const handleChange = (newText) => {
        setCode(newText);
        // Send new text to Socket.io server
        socketRef.current.emit('text change', newText);
    };

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
        // Send new language to Socket.io server
        socketRef.current.emit('language change', newLanguage);
    };

    const handleCompile = () => {
        // Send code and language to the server for compilation
        socketRef.current.emit('compile', { code, language });
    };

    const handleSendMessage = () => {
        if (chatInput.trim()) {
            // Send chat message to Socket.io server
            const message = { userId, text: chatInput };
            socketRef.current.emit('chat message', message);
            setChatInput('');
        }
    };

    return (
        <SocketContext.Provider value={{ code, output, messages, userId,language, chatInput, handleChange, handleCompile, handleLanguageChange, handleSendMessage,setChatInput }}>
            {children}
        </SocketContext.Provider>
    );

};

export {SocketContext, SocketProvider};
  
