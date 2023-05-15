import React from 'react';
import './Instructions.css';

const Instructions = () => {
  return (
    <div className="container">
      <div className="white-rounded-rectangle">
        <div className="title">
            <h1>Werewolf Game Instructions</h1>
        </div>
        <div className="section">
        <h2 className="section-title">Objective:</h2>
        <div className="section-description">
            <p>
            The objective of the game is to identify and eliminate the werewolves
            among the players before they outnumber the innocent villagers.
            </p>
        </div>
        </div>
        <div className="section">
        <h2 className="section-title">Roles:</h2>
        <div className="section-description">
            <ul className="role-list">
            <li className="role">Werewolf</li>
            <li className="role">Villager</li>
            <li className="role">Guard</li>
            <li className="role">Seer</li>
            </ul>
            <p>
            Each player is assigned a role. The werewolves try to eliminate
            villagers at night, while the villagers and other special roles try
            to identify and eliminate the werewolves during the day.
            </p>
        </div>
        </div>
        <div className="section">
        <h2 className="section-title">Gameplay:</h2>
        <div className="section-description">
            <p>
            The game is played in turns. At night, the werewolves secretly choose
            a villager to eliminate. During the day, all players discuss and vote
            on who they suspect to be a werewolf. The player with the most votes
            is eliminated.
            </p>
        </div>
        </div>
        <div className="section">
        <h2 className="section-title">Winning:</h2>
        <div className="section-description">
            <p>
            The game ends when either all the werewolves are eliminated, or when
            the number of werewolves is equal to or greater than the number of
            villagers. The winning team is determined based on the remaining
            roles.
            </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
