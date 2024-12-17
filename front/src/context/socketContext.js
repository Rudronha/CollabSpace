import React, { useState, useEffect, createContext, useMemo, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [code, setCode] = useState('// Write your code here');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [userId, setUserId] = useState(null);
    const socketRef = useRef(null); // Using ref to store socket instance
    const [currentRoomId, setCurrentRoomId] = useState(null);

    useEffect(() => {
        const token = "valid-token"; // Replace with a proper token retrieval method
        const socketInstance = io(process.env.REACT_APP_API_URL, { query: { token } });

        socketInstance.on('connect', () => {
            console.log('Socket connected');
            socketRef.current = socketInstance; // Store the socket instance in the ref
        });

        socketInstance.on('room-created', (roomId) => {
            console.log(`Room created with ID: ${roomId}`);
            alert(`Share this Room ID with friends: ${roomId}`);
            setCurrentRoomId(roomId);
        });

        socketInstance.on('room-joined', (roomId) => {
            console.log(`Successfully joined room: ${roomId}`);
            setUserId(socketInstance.id);
            alert(`You joined the room: ${roomId}`);
            setCurrentRoomId(roomId);
        });

        socketInstance.on('text change', (text) => setCode(text));
        socketInstance.on('language change', (language) => setLanguage(language));
        socketInstance.on('compile result', (result) => setOutput(result.output));

        socketInstance.on('receive-chat-message', ({ userId, message }) => {
            setMessages((prevMessages) => [...prevMessages, message ]);
        });

        socketInstance.on('error', (message) => {
            console.error(message);
            alert(message);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const createRoom = useCallback(async () => {
        if (!socketRef.current) {
            console.error('Socket is not connected yet.');
            return; // Early exit if socket is not connected
        }
        try {
            const response = await fetch('http://localhost:5000/create-room', { method: 'GET' });
            if (!response.ok) throw new Error('Failed to create room');
            const data = await response.json();
            
            //console.log(data.roomCode);
            socketRef.current.emit('create-room', data.roomCode); // Emit using socketRef directly
            
            return data.roomCode;
        } catch (error) {
            console.error('Error creating room:', error);
        }
    }, []);

    const joinRoom = useCallback(async (code) => {
        if (!socketRef.current) {
            console.error('Socket is not connected yet.');
            return; // Early exit if socket is not connected
        }
        try {
            const response = await fetch(`http://localhost:5000/join-room/${code}`);
            if (response.ok) {
                socketRef.current.emit('join-room', code); // Emit using socketRef directly
                console.log(`Joined room: ${code}`);
            } else {
                console.error('Room not found');
            }
        } catch (error) {
            console.error('Error joining room:', error);
        }
    }, []);

    const handleChange = useCallback((newText) => {
        if (!currentRoomId || !socketRef.current) {
            console.error('Cannot emit text change: No room code or socket not connected');
            return;
        }
        setCode(newText);
        console.log(currentRoomId);
        socketRef.current.emit('text change', { roomId:currentRoomId, text:newText }); // Emit using socketRef directly
    }, [currentRoomId]);

    const handleLanguageChange = useCallback((newLanguage) => {
        if (!currentRoomId || !socketRef.current) {
            console.error('Cannot emit language change: No room code or socket not connected');
            return;
        }
        setLanguage(newLanguage);
        socketRef.current.emit('language change', { roomId: currentRoomId, newLanguage });
    }, [currentRoomId]);

    const handleCompile = useCallback(() => {
        if (!currentRoomId || !socketRef.current) {
            console.error('Cannot compile: No room code or socket not connected');
            return;
        }
        socketRef.current.emit('compile', { roomId: currentRoomId, code, language });
    }, [currentRoomId, code, language]);

    const handleSendMessage = useCallback(() => {
        if (!chatInput.trim() || !currentRoomId || !socketRef.current) {
            console.error('Cannot send message: No room code, empty message, or socket not connected');
            return;
        }
        const message = { userId, text: chatInput };
        socketRef.current.emit('send-chat-message', { roomId: currentRoomId, message });
        setChatInput('');
    }, [chatInput, currentRoomId, userId]);

    const contextValue = useMemo(() => ({
        code,
        output,
        messages,
        userId,
        language,
        chatInput,
        currentRoomId,
        setChatInput,
        joinRoom,
        createRoom,
        handleChange,
        handleCompile,
        handleLanguageChange,
        handleSendMessage,
    }), [code, output, messages, userId, language, chatInput, currentRoomId]);

    return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

export { SocketContext, SocketProvider };
