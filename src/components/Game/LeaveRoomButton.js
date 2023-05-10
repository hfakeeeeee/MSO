import React from 'react';

const LeaveRoomButton = ({ leaveRoom }) => {
  return (
    <button onClick={leaveRoom}>Leave room</button>
  );
};

export default LeaveRoomButton;
