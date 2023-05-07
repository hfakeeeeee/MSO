// Home.js
import React from 'react';
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Welcome to Ma Sói Game</h1>
      <button onClick={() => navigate("/login")}>Login</button>
      <button>Register</button>
    </div>
  );
};

export default Home;
