import React, { useContext, useRef, useState } from 'react';
import Sidebar from './components/sidebar';
import './App.css';
import Navbar from './components/navbar';
import Window from './components/window';
import CodeEditor from './components/editor';
import useSafeResizeObserver from './hooks/useSafeResizeObserver';
import { SocketContext } from './context/socketContext';

const App = () => {
  const [selectedMenu, setSelectedMenu] = useState('Teams');
  const [isvisible, setVisible] = useState(false); // Set initial state to false
  //const [code, setCode] = useState('// Write your code here');
  const { code , handleChange, language, handleLanguageChange, handleCompile,output } = useContext(SocketContext);
  //const [language, setLanguage] = useState('javascript');
  const appRef = useRef();

  useSafeResizeObserver(appRef, (entries) => {
    for (let entry of entries) {
      console.log('Window resized:', entry);
    }
  });

  const handleSelect = (menu) => {
    setSelectedMenu(menu);
    setVisible(true); // Open window on menu selection
  };

  
  const handleCloseWindow = () => {
    setVisible(false);
  };

  return (
    <div className="App" ref={appRef}>
      <Sidebar onSelect={handleSelect} />
      <Navbar language={language} setLanguage={handleLanguageChange}/>
      <div className='container'>
        <CodeEditor language={language} value={code} onChange={(newCode) => handleChange(newCode)} />
        <div className='output-container'>
          <div className='output-header'><div className='out'>output:</div><div className='run' onClick={handleCompile}>Run the Code</div></div>
          <pre>{output}</pre>
        </div>
      </div>
      {isvisible && <Window selectedMenu={selectedMenu} onClose={handleCloseWindow} />}
    </div>
  );
};

export default App;
