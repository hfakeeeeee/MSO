import React, { useState } from "react";
import { auth } from "../../firebase";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const user = userCredential.user;

      const name = email.split('@')[0]; // Lấy phần trước ký tự '@' của địa chỉ email
      await updateProfile(user, {
        displayName: name
      });

      // Create a reference to the users node
      const db = getDatabase();
      const usersRef = ref(db, `users/${user.uid}`);

      // Set the user data
      await set(usersRef, {
        Name: name,
        UserID: user.uid,
        email: user.email
      });

      navigate("/Lobby");
    } catch (error) {
      console.error(error);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register">
      <h1 className="header-signup">SIGN UP</h1>
      <form onSubmit={handleRegister}>
        <div className="form-container">
          <div className="form-group">
            <input className="register-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input className="register-input"
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
