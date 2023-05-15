import React from "react";
import PlayerCard from "./PlayerCard";

const PlayerGrid = ({ room, user, handleVote, currentVote, timeForm }) => {
  return (
    <div className="players-grid">
      {Array.from({ length: 16 }, (_, i) => i).map((_, index) => {
        const playerId = room.players ? Object.keys(room.players)[index] : null;
        let playerData = room.players && room.players[playerId];
        const isCurrentUser = user && user.uid === playerId;
        const isCurrentUserWolf =
          user && room.players?.[user.uid]?.role === "Ma sói";
        const isWolf = user && room.players?.[playerId]?.role === "Ma sói";
        const bothWolf = isWolf && room.players?.[user.uid]?.role === "Ma sói";

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
            players={room.players}
            timeForm={timeForm}
            bothWolf={bothWolf}
            isCurrentUserWolf={isCurrentUserWolf}
          />
        );
      })}
    </div>
  );
};

export default PlayerGrid;
