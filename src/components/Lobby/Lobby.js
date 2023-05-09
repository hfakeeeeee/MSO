// src/components/Lobby/Lobby.js
import React, { useEffect, useState } from 'react';
import { auth, database } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { onValue, ref, push, set, child, update } from 'firebase/database'; // Thêm 'child' và 'update' vào đây

import './Lobby.css';

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const roomRef = ref(database, 'rooms');
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
  
    const roomRef = ref(database, 'rooms');
    const newRoom = {
      name: newRoomName,
      players: {
        [user.uid]: {
          displayName: user.displayName || user.email,
          role: 0,
          live: 'live',  // Trang thái sống chết của người chơi
          status: 'waiting', // Chờ người chơi khác
        },
      },
      status: 'waiting', // Trạng thái của phòng
      timeForm: 'day', // trạng thái ngày hoặc đêm trong game
      currentTurn: 0,
      maxPlayer:16, 
      minPlayer:8,
    };
  
    push(roomRef, newRoom);
  
    setNewRoomName('');
  };
  

  const joinRoom = async (roomId) => {
    if (!user) return;
    const roomRef = ref(database, `rooms/${roomId}`);
    const playersRef = child(roomRef, 'players');
    await update(playersRef, {
      [user.uid]: {
        displayName: user.displayName || user.email,
        role: 0,
        live: 'live',
        status: 'waiting',
      },
    });
    navigate(`/game/${roomId}`);
  };
  

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="lobby">
      <h1>Lobby</h1>
      {user && <p>Welcome, {user.displayName || user.email}!</p>}
      <button onClick={handleLogout}>Logout</button>
      <input    type="text"
    placeholder="New room name"
    value={newRoomName}
    onChange={(e) => setNewRoomName(e.target.value)}
  />
  <button onClick={createRoom}>Create Room</button>
  <h2>Rooms:</h2>
  <ul className="room-list">
    {rooms.map((room) => (
      <li key={room.id} onClick={() => joinRoom(room.id)}>
        {room.name}
      </li>
    ))}
  </ul>
</div>
);
};

export default Lobby;
       
