import React, { useContext, useState,useEffect } from 'react';
import { WebRTContext } from '../../context/webRTContext';

const VoiceCall = () => {
    
    const { localStreamRef, remoteStreamRef, isMuted, toggleMute, createOffer } = useContext(WebRTContext);
    const [isCallActive, setIsCallActive] = useState(false);

    const handleCall = () => {
        setIsCallActive(!isCallActive);
        createOffer();
    };

    useEffect(() => {
        if (localStreamRef.current) {
            console.log('localStreamRef assigned:', localStreamRef.current);
        }
    }, [localStreamRef]);

    return (
        <div>
            <h1>Voice Call</h1>
            <button onClick={handleCall} disabled={isCallActive}>Call</button>
            <button onClick={toggleMute}>
                {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <div>
                <h2>Local Stream</h2>
                <audio ref={localStreamRef} autoPlay muted={isMuted}/>
            </div>
            <div>
                <h2>Remote Stream</h2>
                <audio ref={remoteStreamRef} autoPlay />
            </div>
        </div>
    );
};

export default VoiceCall;
