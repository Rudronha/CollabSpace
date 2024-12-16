import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatApp = () => {
    const [roomCode, setRoomCode] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Set up the socket message listener once when the component mounts
        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Clean up the listener on component unmount
        return () => {
            socket.off('message');
        };
    }, []); // Empty dependency array ensures this runs only once

    const createRoom = async () => {
        const response = await fetch('http://localhost:5000/create-room', { method: 'GET' });
        const data = await response.json();
        alert(`Room created! Code: ${data.roomCode}`);
    };

    const joinRoom = () => {
        socket.emit('joinRoom', roomCode);
    };

    const sendMessage = () => {
        socket.emit('message', { roomCode, message });
        setMessage('');
    };

    return (
        <div>
            <button onClick={createRoom}>Create Room</button>
            <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
            />
            <button onClick={joinRoom}>Join Room</button>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send Message</button>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
};

export default ChatApp;
