import React, { useContext, useState } from 'react';
import Navbar from './MainNavbar';
import './Main.css';
import { SocketContext } from '../context/socketContext';

const Main = () => {
    const [labCode, setLabCode] = useState('');
    const [generatedRoomCode, setGeneratedRoomCode] = useState('');
    const { createRoom, roomCode, joinRoom } = useContext(SocketContext);

    const generateRoomCode = () => {
        createRoom();
        if (roomCode) {
            setGeneratedRoomCode(roomCode);
        }
    };

    const joinLab = () => {
        if (labCode) {
            joinRoom(labCode);
            const token = 'valid-token'; // Generate or fetch a valid token for the room
            const meetUrl = `/class?token=${token}`; // Assuming the app runs locally; modify as needed
            window.open(meetUrl, "_blank", "noopener,noreferrer");
        } else {
            alert('Please enter a room code');
        }
    };

    return (
        <div>
            <div className="container">
                <Navbar />
                <div className="half">
                    <h2>Create a Room</h2>
                    <button className="button" onClick={generateRoomCode}>
                        Generate Room Code
                    </button>
                    {generatedRoomCode && (
                        <div className="code-container">
                            <p>Room Code: <strong>{generatedRoomCode}</strong></p>
                            <button
                                className="copy-button"
                                onClick={() => navigator.clipboard.writeText(generatedRoomCode)}
                            >
                                Copy Code
                            </button>
                        </div>
                    )}
                </div>
                <div className="half">
                    <h2>Join a Room</h2>
                    <input
                        type="text"
                        value={labCode}
                        onChange={(e) => setLabCode(e.target.value)}
                        placeholder="Enter room code"
                        className="input"
                    />
                    <button className="button" onClick={joinLab}>
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Main;
