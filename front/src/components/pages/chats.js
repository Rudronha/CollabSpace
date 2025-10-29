import React, { useContext } from 'react';
import './chats.css';
import { SocketContext } from '../../context/socketContext';

const Chats = () => {
  const { messages, handleSendMessage, chatInput, setChatInput, userId} = useContext(SocketContext);

  //console.log(messages);
  return (
    <div className="chats-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.userId === userId ? 'user' : 'response'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chats;
