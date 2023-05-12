// src/components/Lobby/Lobby.js
import React, { useEffect, useState } from "react";
import { auth, database } from "../../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { onValue, ref, push, set, child, update } from "firebase/database";
import { BsPersonFill, BsPower } from "react-icons/bs";

import "./Lobby.css";

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [user, setUser] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showCreateGameInput, setShowCreateGameInput] = useState(false);
  const [newGameName, setNewGameName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const roomRef = ref(database, "rooms");
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const roomsData = snapshot.val();
      const roomList = [];
      for (const roomId in roomsData) {
        roomList.push({ id: roomId, ...roomsData[roomId] });
      }
      setRooms(roomList);
    });

    const userUnsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
      userUnsubscribe();
    };
  }, []);

  const createRoom = () => {
    if (!newRoomName) return;

    const roomRef = ref(database, "rooms");
    const newRoom = {
      name: newRoomName,
      players: {
        [user.uid]: {
          displayName: user.displayName || user.email,
          role: 0,
          live: "live",
          status: "waiting",
        },
      },
      status: "waiting",
      timeForm: "day",
      currentTurn: 0,
      maxPlayer: 16,
      minPlayer: 8,
    };

    push(roomRef, newRoom);

    setNewRoomName("");
  };

  const joinRoom = async (roomId) => {
    if (!user) return;
    const roomRef = ref(database, `rooms/${roomId}`);
    const playersRef = child(roomRef, "players");
    await update(playersRef, {
      [user.uid]: {
        displayName: user.displayName || user.email,
        role: 0,
        live: "live",
        status: "waiting",
      },
    });
    navigate(`/game/${roomId}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  const toggleCreateGameInput = () => {
    setShowCreateGameInput(!showCreateGameInput);
  };

  const createGame = () => {
    if (!newGameName) return;

    const roomRef = ref(database, "rooms");
    const newRoom = {
      name: newGameName,
      players: {
        [user.uid]: {
          displayName: user.displayName || user.email,
          role: 0,
          live: "live",
          status: "waiting",
        },
      },
      status: "waiting",
      timeForm: "day",
      currentTurn: 0,
      maxPlayer: 16,
      minPlayer: 8,
    };

    push(roomRef, newRoom);

    setNewGameName("");
    setShowCreateGameInput(false);
  };

  const toggleInstructions = () => {
    navigate("/instructions");
  };

  return (
    <div className="lobby">
      {user && (
        <div className="user-info">
          <BsPersonFill className="user-icon" onClick={toggleUserInfo} />
          {showUserInfo && (
            <div className="user-info-popup">
              <p>{user.displayName || user.email}</p>
            </div>
          )}
          <BsPower className="logout-icon" onClick={handleLogout} />
        </div>
      )}
      <div className="inside-lobby">
        <div class="button-container">
          <button className="quick-play" onClick={createRoom}>
            Quick Play
          </button>
          <button className="instruction-button" onClick={toggleInstructions}>
            Instructions
          </button>
        </div>
        <div className="create-game-container">
          <button
            className="create-game-button"
            onClick={toggleCreateGameInput}
          >
            Create Game
          </button>
          {showCreateGameInput && (
            <div className="create-game-popup">
              <input
                type="text"
                placeholder="Enter game name"
                value={newGameName}
                onChange={(e) => setNewGameName(e.target.value)}
              />
              <button className="create-button" onClick={createGame}>
                Create
              </button>
            </div>
          )}
        </div>
        <div className="room-list-container">
          <h2>Lastest game room</h2>
          <ul className="room-list">
            {rooms.slice(-5).map((room) => (
              <li key={room.id} onClick={() => joinRoom(room.id)}>
                {room.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
