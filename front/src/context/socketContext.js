import React, { useState, useEffect, useRef, createContext, useMemo } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [code, setCode] = useState('// Write your code here');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [userId, setUserId] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const socketRef = useRef();

    useEffect(() => {
        // Connect to the Socket.io server with token authentication
        const token = "valid-token"; // Replace with a proper token retrieval method
        socketRef.current = io(process.env.REACT_APP_API_URL, { query: { token } });

        socketRef.current.on('connect', () => {
            setUserId(socketRef.current.id);
            console.log('Connected to server');
        });

        socketRef.current.on('text change', (newText) => setCode(newText));
        socketRef.current.on('language change', (newLanguage) => setLanguage(newLanguage));
        socketRef.current.on('compile result', (result) => setOutput(result.output));
        socketRef.current.on('chat message', (message) => setMessages((prev) => [...prev, message]));

        // Handle reconnection
        socketRef.current.on('reconnect', () => {
            console.log('Reconnected to server');
            if (roomCode) {
                socketRef.current.emit('joinRoom', roomCode);
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomCode]);

    const createRoom = async () => {
        try {
            const response = await fetch('http://localhost:5000/create-room', { method: 'GET' });
            if (!response.ok) throw new Error('Failed to create room');

            const data = await response.json();
            setRoomCode(data.roomCode);
            socketRef.current.emit('createRoom', data.roomCode);
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const joinRoom = async (code) => {
        try {
            const response = await fetch(`http://localhost:5000/join-room/${code}`);
            if (response.ok) {
                socketRef.current.emit('joinRoom', code);
                setRoomCode(code);
                console.log(`Joined room: ${code}`);
            } else {
                console.error('Room not found');
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const handleChange = (newText) => {
        if (!roomCode) {
            console.error('Cannot emit text change: No room code');
            return;
        }
        setCode(newText);
        socketRef.current.emit('text change', { roomCode, newText });
    };

    const handleLanguageChange = (newLanguage) => {
        if (!roomCode) {
            console.error('Cannot emit language change: No room code');
            return;
        }
        setLanguage(newLanguage);
        socketRef.current.emit('language change', { roomCode, newLanguage });
    };

    const handleCompile = () => {
        if (!roomCode) {
            console.error('Cannot compile: No room code');
            return;
        }
        socketRef.current.emit('compile', { roomCode, code, language });
    };

    const handleSendMessage = () => {
        if (!chatInput.trim() || !roomCode) {
            console.error('Cannot send message: No room code or message is empty');
            return;
        }
        const message = { userId, text: chatInput };
        socketRef.current.emit('chat message', { roomCode, message });
        setChatInput('');
    };

    const contextValue = useMemo(() => ({
        code,
        output,
        messages,
        userId,
        language,
        chatInput,
        roomCode,
        setChatInput,
        joinRoom,
        createRoom,
        handleChange,
        handleCompile,
        handleLanguageChange,
        handleSendMessage,
    }), [code, output, messages, userId, language, chatInput, roomCode]);

    return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

export { SocketContext, SocketProvider };
