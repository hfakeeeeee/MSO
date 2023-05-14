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
      className={`player-card ${!isCurrentUser && playerData ? 'clickable' : ''} ${!isAlive ? 'dead-player' : ''} ${isCurrentUser && isAlive ? 'current-user' : ''} ${bothWolf ? 'wolf' : ''}`}
      onClick={!isCurrentUser && playerData ? () => handleVote(playerId) : undefined}
    >
      <div className="player-rectangle">
        <div className="player-number">{playerIndex + 1}.</div>
        <div className="player-name">{playerName}</div> {/* Player name to the right of player number */}
      </div>
      <div className="player-votes">
        <div> ({timeForm === 'night' && isCurrentUserWolf ? voteWolfCount : voteCount} votes) </div>
        {/* Rest of the code */}
      </div>
    </div>
  );
};

export default PlayerCard;
