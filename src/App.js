import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Lobby from './components/Lobby/Lobby';
import Game from './components/Game/Game';
import Results from './components/Results/Results';
import Instructions from './components/Instructions/Instructions';
import Register from './components/Login/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth, AuthProvider } from './AuthContext';

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby" element={currentUser ? <Lobby /> : <Login />} />
        <Route path="/game/:roomId" element={currentUser ? <Game /> : <Login />} />
        <Route path="/results" element={currentUser ? <Results /> : <Login />} />
        <Route path="/instructions" element={currentUser ? <Instructions /> : <Login />} />
      </Routes>
    </Router>
  );
}

// This is the component that gets rendered in your root index.js file
function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default Root;
