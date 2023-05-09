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
      const userCredential = createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      navigate("/Lobby");
      // Registration successful, you can now perform additional actions, e.g., update profile, redirect to another page, etc.
    } catch (error) {
      // Handle registration errors here.
      console.error(error);
    }
  };

  return (
    <div className="register">
        <h1>REGISTER</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="email"
              placeholder="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="button-group-2">
            <button className="signup-btn-2" type="submit">
              Sign up
            </button>
            <div className="login-link">
              <p onClick={() => navigate("/login")}>If you already have an account, login here</p>
            </div>
        </div>
        </form>
    </div>
  );
};

export default Register;
