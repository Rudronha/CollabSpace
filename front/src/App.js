import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Meet from './components/Meet';
import Main from './components/Main';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/class" element={<SecureRoute />} />
      </Routes>
    </Router>
  );
};

function SecureRoute() {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');

  // Simple token validation logic (replace with an actual validation check)
  if (token && token === 'valid-token') {
    return <Meet/>;
  } else {
    return <Navigate to="/home" />;
  }
}

export default App;
