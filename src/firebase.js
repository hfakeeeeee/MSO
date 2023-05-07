import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBfwA7dEyWug1NPxQKdw0_zSNgmcNmJQdw",
  authDomain: "masoigame-dfb05.firebaseapp.com",
  projectId: "masoigame-dfb05",
  storageBucket: "masoigame-dfb05.appspot.com",
  messagingSenderId: "682238712532",
  appId: "1:682238712532:web:3cfeda2aa0db79ae6bf941",
  measurementId: "G-9L0E2KV0R0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
