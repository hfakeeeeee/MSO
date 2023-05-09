// src/components/Game/Game.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { auth, database } from '../../firebase';
import { ref, onValue, off, update } from 'firebase/database';
import { assignRoles } from './roles';
import Chat from './Chat';
import './Game.css';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;

const Game = () => {
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [isGameReady, setIsGameReady] = useState(false);
  const { roomId } = useParams();

  const startGame = async () => {
    if (!room || !room.players) return;
  
    const assignedRoles = assignRoles(room.players);
  
    const updates = {};
    Object.keys(assignedRoles).forEach((playerId) => {
      updates[`rooms/${roomId}/players/${playerId}/role`] = assignedRoles[playerId];
    });
  
    await update(ref(database), updates); // Sửa ở đây
  };
  

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);
    const userUnsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    const roomUnsubscribe = onValue(roomRef, (snapshot) => {
      const roomData = snapshot.val();
      if (roomData) {
        setRoom({ id: roomId, ...roomData });
      } else {
        alert('Phòng không tồn tại');
        window.location.href = "/lobby";
      }
    });

    return () => {
      roomUnsubscribe();
      userUnsubscribe();
      off(roomRef);
    };
  }, [roomId]);

  useEffect(() => {
    if (!room) return;

    const roomPlayersRef = ref(database, `rooms/${roomId}/players`);
    const playersUnsubscribe = onValue(roomPlayersRef, (snapshot) => {
      const playersData = snapshot.val();
      setRoom((prevState) => ({ ...prevState, players: playersData }));

      // Kiểm tra số lượng người chơi trong phòng
      const playerCount = playersData ? Object.keys(playersData).length : 0;
      setIsGameReady(playerCount >= MIN_PLAYERS && playerCount <= MAX_PLAYERS);
    });

    return () => {
      off(roomPlayersRef, playersUnsubscribe);
    };
  }, [room, roomId]);

  useEffect(() => {
    if (isGameReady) {
      startGame();
    }
  }, [isGameReady]);

  const leaveRoom = async () => {
    if (!user || !room) return;

    const roomPlayersRef = ref(database, `rooms/${roomId}/players`);
    await update(roomPlayersRef, {
      [user.uid]: null,
    });

    window.location.href = "/lobby";
  };

  if (!room) return <div>Loading...</div>;

  return (
    <div className="game">
      <h1>{room.name}</h1>
      <h2>Players:</h2>
      <ul>
        {room.players && Object.entries(room.players).map(([playerId, playerData]) => (
          <li key={playerId}>{playerData.displayName || playerData.email}</li>
        ))}
      </ul>
      <button onClick={leaveRoom}>Leave room</button>
      {/* Thêm các tính năng của trò chơi tại đây */}
      {isGameReady && <div className="game-ready">Trò chơi sẵn sàng bắt đầu!</div>}

      {/* Thêm thành phần Chat */}
      {user && room && <Chat roomId={room.id} user={user} />}
    </div>
  );
};

export default Game;
