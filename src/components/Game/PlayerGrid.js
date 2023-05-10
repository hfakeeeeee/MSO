import React from 'react';
import PlayerCard from './PlayerCard';

const PlayerGrid = ({ room, user, handleVote, currentVote }) => {
  return (
    <div className="players-grid">
      {Array.from({ length: 16 }, (_, i) => i).map((_, index) => {
        const playerId = room.players ? Object.keys(room.players)[index] : null;
        const playerData = room.players && room.players[playerId];
        const isCurrentUser = user && user.uid === playerId;

        return (
          <PlayerCard
            key={index}
            playerId={playerId}
            playerIndex={index}
            playerData={playerData}
            isCurrentUser={isCurrentUser}
            handleVote={handleVote}
            room={room}
            currentVote={currentVote}
            players = {room.players}
          />
        );
      })}
    </div>
  );
};

export default PlayerGrid;
