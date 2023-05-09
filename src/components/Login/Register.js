import React, { useState } from "react";
import { auth } from "../../firebase";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/Lobby");
      // Registration successful, you can now perform additional actions, e.g., redirect to another page, etc.
    } catch (error) {
      // Handle registration errors here.
      console.error(error);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register">
      <h1>SIGN UP</h1>
      <form onSubmit={handleRegister}>
        <div className="form-container">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-group-2">
            <button className="register-signup-btn" type="submit">
              Sign Up
            </button>
          </div>
          <div className="login-link-container">
            <p className="login-link" onClick={goToLogin}>
              If you already have an account, just login here.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
