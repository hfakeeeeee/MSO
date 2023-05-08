// src/components/Login/Login.js
import React, { useState } from "react";
import { auth } from "../../firebase";
import "./Login.css";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      navigate("/Lobby");
      // Login successful, you can now perform additional actions, e.g., redirect to another page, etc.
    } catch (error) {
      // Handle login errors here.
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Registration successful, you can now perform additional actions, e.g., update profile, redirect to another page, etc.
    } catch (error) {
      // Handle registration errors here.
      console.error(error);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h1>{isLogin ? "Login" : "Register"}</h1>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <div className="switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register here" : "Already have an account? Login here"}
        </div>
      </div>
    </div>
  );
};

export default Login;