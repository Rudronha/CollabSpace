import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Meet from './components/Meet';
import Main from './components/Main';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
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
