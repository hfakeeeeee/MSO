import React from "react";

const LeaveRoomButton = ({ leaveRoom }) => {
  return <button className="leave-room-button" onClick={leaveRoom}>Leave room</button>;
};

export default LeaveRoomButton;
