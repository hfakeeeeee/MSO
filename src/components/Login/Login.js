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
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate("/Lobby");
      // Login successful, you can now perform additional actions, e.g., redirect to another page, etc.
    } catch (error) {
      // Handle login errors here.
      console.error(error);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login">
      <h1>LOGIN</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input className="login-input"
            type="email"
            placeholder="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input className="login-input"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button className="login-btn" type="submit">
            Sign in
          </button>
          <button className="signup-btn" onClick={goToRegister}>
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
