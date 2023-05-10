import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { auth, database } from '../../firebase';
import { ref, onValue, off, update, push, set, serverTimestamp, get, orderByChild, limitToLast, query } from 'firebase/database';
import { assignRoles } from './roles';
import Chat from './Chat';
import PlayerGrid from './PlayerGrid';
import LeaveRoomButton from './LeaveRoomButton';
import './Game.css';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 16;
const TIME_REMAINING_DAY = 9;
const TIME_REMAINING_VOTING = 3;
const TIME_REMAINING_NIGHT = 6;


const Game = () => {
    const [room, setRoom] = useState(null);
    const [user, setUser] = useState(null);
    const [isGameReady, setIsGameReady] = useState(false);
    const { roomId } = useParams();
    const [currentVote, setCurrentVote] = useState(null);
    const [countdown, setCountdown] = useState(null);
    const [timeForm, setTimeForm] = useState('day');
    const [timeRemaining, setTimeRemaining] = useState(null);



    const countdownStarted = useRef(false);
    
    const clearVotes = async () => {
        if (!room || !room.players) return;
      
        const updates = {};
        Object.keys(room.players).forEach((playerId) => {
          updates[`rooms/${roomId}/players/${playerId}/isVoted`] = null;
          updates[`rooms/${roomId}/players/${playerId}/vote`] = null;
        });
      
        await update(ref(database), updates);
      };
    const startGame = useCallback(async () => {
        if (!room || !room.players || room.status == 'playing') return;
    
        const assignedRoles = assignRoles(room.players);
    
        const updates = {};
        Object.keys(assignedRoles).forEach((playerId) => {
          updates[`rooms/${roomId}/players/${playerId}/role`] = assignedRoles[playerId];
        });
    
        await update(ref(database), updates);
        await update(ref(database), {
            [`rooms/${roomId}/status`]: 'playing',
          });
        startDayTime(); 

      }, [room]);
      
      const startDayTime = useCallback(() => {
        const startTime = Date.now();
        setTimeForm('day');
        update(ref(database), { [`rooms/${roomId}/timeRemaining`]: TIME_REMAINING_DAY, [`rooms/${roomId}/startTime`]: startTime, [`rooms/${roomId}/timeForm`]: 'day' });
      }, []);
      
      const startVotingTime = useCallback(() => {
        const startTime = Date.now();
        setTimeForm('voting');
        update(ref(database), { [`rooms/${roomId}/timeRemaining`]: TIME_REMAINING_VOTING, [`rooms/${roomId}/startTime`]: startTime, [`rooms/${roomId}/timeForm`]: 'voting' });
      }, []);
      
      const startNightTime = useCallback(() => {
        const startTime = Date.now();
        setTimeForm('night');
        update(ref(database), { [`rooms/${roomId}/timeRemaining`]: TIME_REMAINING_NIGHT, [`rooms/${roomId}/startTime`]: startTime, [`rooms/${roomId}/timeForm`]: 'night' });
      }, []);
      
      const eliminatePlayer = async () => {
        if (!room || !room.players) return;
      
        // Đếm số người chơi còn sống
        const livePlayers = Object.values(room.players).filter(
          (player) => player.live === "live"
        );
        const livePlayerCount = livePlayers.length;
      
        // Đếm phiếu bầu
        const voteCounts = {};
        Object.values(room.players).forEach((player) => {
          if (player.vote && player.live === "live") {
            voteCounts[player.vote] = (voteCounts[player.vote] || 0) + 1;
          }
        });
      
        // Tìm người chơi có số phiếu bầu lớn nhất
        const maxVotes = Math.max(...Object.values(voteCounts));
        const maxVotedPlayers = Object.keys(voteCounts).filter(
          (playerId) => voteCounts[playerId] === maxVotes
        );
      
        // Kiểm tra nếu chỉ có một người chơi nhận được ít nhất 50% số phiếu bầu
        if (
          maxVotedPlayers.length === 1 &&
          maxVotes >= Math.ceil(livePlayerCount / 2)
        ) {
          const eliminatedPlayerId = maxVotedPlayers[0];
          await update(ref(database), {
            [`rooms/${roomId}/players/${eliminatedPlayerId}/live`]: "die",
          });
        }
      };
      
      
    const getCountdownMessage = useCallback((secondsRemaining) => {
        return `Trò chơi sẽ bắt đầu sau ${secondsRemaining} giây.`;
      }, []);

 
      useEffect(() => {
        if (room && room.timeForm) {
          setTimeForm(room.timeForm);
        }
      }, [room]);
      

      useEffect(() => {
        const timeRemainingRef = ref(database, `rooms/${roomId}/timeRemaining`);
        const timeRemainingUnsubscribe = onValue(timeRemainingRef, (snapshot) => {
            const timeRemainingValue = snapshot.val();
            if (timeRemainingValue) {
                setTimeRemaining(timeRemainingValue);
            }
        });
    
        return () => {
            timeRemainingUnsubscribe();
            off(timeRemainingRef);
        };
    }, [roomId]);
    
    useEffect(() => {
        if (room && room.timeRemaining && room.startTime) {
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - room.startTime) / 1000);
            const timeLeft = room.timeRemaining - elapsedTime;
    
            if (timeLeft > 0) {
                setTimeRemaining(timeLeft);
            } else {
                setTimeRemaining(0);
            }
        }
    }, [room]);

      // Đếm ngược trò chơi bắt đầu
      useEffect(() => {
        if (countdown !== null) {
          const messageRef = ref(database, `rooms/${roomId}/messages`);
          const lastMessageQuery = query(messageRef, orderByChild("createdAt"), limitToLast(1));
      
          const sendCountdown = async () => {
            const lastMessageSnapshot = await get(lastMessageQuery);
            const lastMessage = lastMessageSnapshot.val();
            const newCountdownMessage = getCountdownMessage(countdown);
      
            if (!lastMessage || Object.values(lastMessage)[0].content !== newCountdownMessage) {
              const newMessageRef = push(messageRef);
              set(newMessageRef, {
                id: newMessageRef.key,
                type: 'countdown',
                content: newCountdownMessage,
                createdAt: serverTimestamp(),
                createdBy: 'system',
              });
            }
          };
      
          sendCountdown();
        }
      }, [countdown, getCountdownMessage, roomId]);
      
      
      useEffect(() => {
        if (room && room.status === 'waiting' && !countdownStarted.current) {
          const numPlayers = Object.keys(room.players).length;
          if (numPlayers >= MIN_PLAYERS) {
            let countdownTimer = 5;
            const intervalId = setInterval(() => {
              setCountdown(countdownTimer);
              countdownTimer -= 1;
              if (countdownTimer < 0) {
                clearInterval(intervalId);
                startGame();
              }
            }, 1000);
            countdownStarted.current = true;
          } else {
            countdownStarted.current = false;
          }
        }
      }, [room, startGame]);
      
      
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
        if (isGameReady && !countdownStarted.current) {
          countdownStarted.current = true;
        }
      }, [isGameReady]);
      
    useEffect(() => {
      if (room && room.players) {
        const numPlayers = Object.keys(room.players).length;
        if (numPlayers >= MIN_PLAYERS) {
          setIsGameReady(true);
        } else {
          setIsGameReady(false);
        }
      }
    }, [room]);

    useEffect(() => {
        if (timeRemaining === null) return;
      
        const intervalId = setInterval(() => {
          setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
        }, 1000);
      
        return () => {
          clearInterval(intervalId);
        };
      }, [timeRemaining]);

      useEffect(() => {
        if (timeRemaining === 0) {
            switch (timeForm) {
                case "day":
                    startVotingTime()
                    break;
                case "voting":
                    eliminatePlayer(); 
                    clearVotes();
                    if (user && room && room.players) {
                        setCurrentVote(null);
                    }                    
                    startNightTime()
                    break;
                case "night":
                    startDayTime()
                    break;
                default:
                    break;
            }
        }
    }, [timeRemaining, timeForm, startVotingTime, startNightTime, startDayTime]);
    
    const isCurrentUserAlive = () => {
        if (user && room && room.players) {
            const currentUserData = room.players[user.uid];
            return currentUserData && currentUserData.live === "live";
        }
        return false;
    };
       
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
    const isPlayerAlive = room.players[playerId].live === "live";

    if (playerId === user.uid || timeForm !== 'voting' || !isCurrentUserAlive() || !isPlayerAlive)  {
        return;
      }
  
    const updates = {};
  
    if (currentVote === playerId) {
      updates[`rooms/${roomId}/players/${playerId}/isVoted/${user.uid}`] = null;
      updates[`rooms/${roomId}/players/${user.uid}/vote`] = null;
      setCurrentVote(null);
    } else {
      if (currentVote) {
        updates[`rooms/${roomId}/players/${currentVote}/isVoted/${user.uid}`] = null;
      }
      updates[`rooms/${roomId}/players/${playerId}/isVoted/${user.uid}`] = true;
      updates[`rooms/${roomId}/players/${user.uid}/vote`] = playerId;
      setCurrentVote(playerId);
    }
  
    await update(ref(database), updates);
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
            <div className="time-form">
            {timeForm === 'day' && (
                <span>
                Ban ngày: Thảo luận ({timeRemaining} giây còn lại)
                </span>
            )}
            {timeForm === 'voting' && (
                <span>
                Bầu chọn ({timeRemaining} giây còn lại)
                </span>
            )}
            {timeForm === 'night' && (
                <span>
                Ban đêm: Thao tác ({timeRemaining} giây còn lại)
                </span>
            )}
        </div>
            <PlayerGrid room={room} user={user} handleVote={handleVote} currentVote={currentVote} />
            <LeaveRoomButton leaveRoom={leaveRoom} />

            {isGameReady && (
            <div className="game-ready">Trò chơi sẵn sàng bắt đầu!</div>
            )}
            {currentUserRole && (
            <div className="current-role">Vai trò của bạn: {currentUserRole}</div>
            )}
            {user && room && <Chat roomId={room.id} user={user} isCurrentUserAlive={isCurrentUserAlive()} />}
        </div>

    );
};

export default Game;