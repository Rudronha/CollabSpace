import React, { useContext, useState } from 'react';
import Navbar from './MainNavbar';
import './Main.css';
import { SocketContext } from '../context/socketContext';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const [labCode, setLabCode] = useState('');
    const [generatedRoomCode, setGeneratedRoomCode] = useState('');
    const { createRoom, joinRoom } = useContext(SocketContext);
    const navigate = useNavigate();

    const generateRoomCode = async () => {
        const roomCode = await createRoom();

        if (roomCode) {
            setGeneratedRoomCode(roomCode);
            setLabCode(roomCode);

            // Directly join the created room
            joinRoom(roomCode);

            const token = 'valid-token'; // Replace with real token if needed
            const meetUrl = `/class?token=${token}&room=${roomCode}`;
            navigate(meetUrl);
        }
    };

    const joinLab = () => {
        if (labCode.trim()) {
            joinRoom(labCode);
            const token = 'valid-token'; 
            const meetUrl = `/class?token=${token}&room=${labCode}`;
            navigate(meetUrl);
        } else {
            alert('Please enter a room code');
        }
    };

    return (
        <div className="container">
            <Navbar />
            <div className="half">
                <h2>Create a Room</h2>
                <button className="button" onClick={generateRoomCode}>
                    Create Room
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
    );
};

export default Main;
