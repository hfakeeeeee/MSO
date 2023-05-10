import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ playerId, playerData, isCurrentUser, handleVote, room, currentVote, playerIndex, players }) => {
  const playerName = playerData
    ? playerData.displayName || playerData.email
    : 'No Player';
  const voteCount = playerData && playerData.isVoted
    ? Object.values(playerData.isVoted).filter(Boolean).length
    : 0;
  const currentUserVote = playerData && playerData.vote;
  const isAlive = players?.[playerId]?.live === 'live'; // Lấy thông tin "live"


  return (
    <div
    className={`player-card ${!isCurrentUser && playerData ? 'clickable' : ''} ${isCurrentUser ? 'current-user' : ''} ${!isAlive ? 'dead-player' : ''}`}
    onClick={!isCurrentUser && playerData ? () => handleVote(playerId) : undefined}>
      
      <div className="player-number">{playerIndex + 1}</div>
      <div className="player-name">
        {playerName}
        <div> ({voteCount} votes) </div>
        {playerData && isCurrentUser && (
          <p>Đang bầu: {room.players[currentVote]?.displayName || room.players[currentVote]?.email || 'Chưa bầu'}</p>
        )}
        {playerData && !isCurrentUser && (
          <p>Đang bầu: {room.players[currentUserVote]?.displayName || room.players[currentUserVote]?.email || 'Chưa bầu'}</p>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
