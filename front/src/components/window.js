import React, { useRef } from 'react';
import './window.css';
import useSafeResizeObserver from '../hooks/useSafeResizeObserver';
import Chats from './pages/chats';
import Call from './pages/call';
const Window = ({ selectedMenu, onClose }) => {
  const winRef = useRef();

  useSafeResizeObserver(winRef, (entries) => {
    for (let entry of entries) {
      console.log('Window resized:', entry);
    }
  });

  return (
    <div className="window" ref={winRef}>
      <div className="window-header">
        <h3>{selectedMenu}</h3>
        <div className='close-icon' onClick={onClose}>x</div>
      </div>
      <div className="window-content">
        {selectedMenu==='Chat'?<Chats/>:''}
        {selectedMenu==='Call'?<Call/>:''}
      </div>
    </div>
  );
};

export default Window;
