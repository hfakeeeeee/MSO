import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ playerId, playerData, isCurrentUser, handleVote, room, currentVote, playerIndex, players, timeForm, bothWolf, isCurrentUserWolf }) => {
  const playerName = playerData
    ? playerData.displayName || playerData.email
    : 'No Player';
  const voteCount = playerData && playerData.isVoted
    ? Object.values(playerData.isVoted).filter(Boolean).length
    : 0;
  const voteWolfCount = playerData && playerData.isWolfVoted
    ? Object.values(playerData.isWolfVoted).filter(Boolean).length
    : 0;
  const currentUserVote = playerData && playerData.vote;
  const currentWolfVote = playerData && playerData.nightAction;
  const isAlive = players?.[playerId]?.live === 'live';

  return (
    <div
    className={`player-card ${!isCurrentUser && playerData ? 'clickable' : ''} ${!isAlive ? 'dead-player' : ''} ${isCurrentUser&&isAlive ? 'current-user' : ''}  ${ bothWolf ? 'wolf' : ''}`}
    onClick={!isCurrentUser && playerData ? () => handleVote(playerId) : undefined}>
      
      <div className="player-number">{playerIndex + 1}</div>
      <div className="player-name">
        {playerName}
        <div> (  {timeForm ==='night' && isCurrentUserWolf ? voteWolfCount : voteCount } votes) </div>


        {playerData && isCurrentUser && (
          <p>Đang bầu: {room.players[currentVote]?.displayName || room.players[currentVote]?.email || 'Chưa bầu'}</p>
        )}
        {playerData && !isCurrentUser &&  bothWolf &&  (
          <p>Đang bầu: {room.players[timeForm !== "night"? currentUserVote: currentWolfVote]?.displayName || room.players[currentUserVote]?.email || 'Chưa bầu'}</p>
        )}
        {playerData && !isCurrentUser &&  !bothWolf && (
          <p>Đang bầu: {room.players[currentUserVote]?.displayName || room.players[currentUserVote]?.email || 'Chưa bầu'}</p>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
