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
  const [currentVote, setCurrentVote] = useState(null);


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

  const handleVote = async (playerId) => {
    if (playerId === user.uid || currentVote === playerId) {
        return;
    }
  
    const updates = {};
    if (currentVote) {
      updates[`rooms/${roomId}/players/${currentVote}/votes/${user.uid}`] = null;
    }
    updates[`rooms/${roomId}/players/${playerId}/votes/${user.uid}`] = true;
  
    await update(ref(database), updates);
    setCurrentVote(playerId);
  };
  
  
  
  const getCurrentUserRole = () => {
    if (user && room && room.players) {
      const currentUserData = room.players[user.uid];
      return currentUserData && currentUserData.role;
    }
    return null;
  };

  const currentUserRole = getCurrentUserRole();

  return (
    <div className="game">
      {/* Hiển thị danh sách người chơi dưới dạng lưới */}
      <div className="players-grid">
        {Array.from({ length: 16 }, (_, i) => i).map((_, index) => {
          const playerId = room.players ? Object.keys(room.players)[index] : null;
          const playerData = room.players && room.players[playerId];
          const playerName = playerData
            ? playerData.displayName || playerData.email
            : "No Player";
          const voteCount = playerData && playerData.votes
            ? Object.values(playerData.votes).filter(Boolean).length
            : 0;
          const isCurrentUser = user && user.uid === playerId;
          const currentUserVote = user && playerData && playerData.votes && playerData.votes[user.uid];
  
          return (
            <div key={index} className="player-card">
              <div className="player-name">
                {playerName} ({voteCount} votes)
              </div>
              {/* Thêm nút biểu quyết cho mỗi người chơi, nếu người chơi tồn tại */}
              {playerData && !isCurrentUser && (
                <button
                  className="vote-button"
                  onClick={() => handleVote(playerId)}
                >
                  Biểu quyết
                </button>
              )}
              {/* Hiển thị thông tin về ai người chơi đang biểu quyết */}
              {isCurrentUser ? (
                <p>Bạn không thể biểu quyết cho chính mình</p>
              ) : currentUserVote ? (
                <p>Đang bầu: {playerData.displayName || playerData.email}</p>
              ) : (
                <p>Chưa bầu</p>
              )}
            </div>
          );
        })}
      </div>
      
  
      <button onClick={leaveRoom}>Leave room</button>
      {/* Thêm các tính năng của trò chơi tại đây */}
      {isGameReady && (
        <div className="game-ready">Trò chơi sẵn sàng bắt đầu!</div>
      )}
      {currentUserRole && (
        <div className="current-role">Vai trò của bạn: {currentUserRole}</div>
      )}
      {/* Thêm thành phần Chat */}
      {user && room && <Chat roomId={room.id} user={user} />}
    </div>
  );
};

export default Game;
