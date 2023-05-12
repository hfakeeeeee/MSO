// src/components/Game/Chat.js
import React, { useState, useEffect } from "react";
import { database } from "../../firebase";
import { ref, onValue, off, push } from "firebase/database";
import "./Chat.css";

const Chat = ({ roomId, user, isCurrentUserAlive }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, `rooms/${roomId}/messages`);

    const messagesUnsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val() || {};
      setMessages(Object.values(messagesData));
    });

    return () => {
      off(messagesRef, messagesUnsubscribe);
    };
  }, [roomId]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      content: newMessage,
      senderId: user.uid,
      senderName: user.displayName || user.email,
      timestamp: Date.now(),
    };

    const messagesRef = ref(database, `rooms/${roomId}/messages`);
    await push(messagesRef, message);

    setNewMessage("");
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.senderName}: </strong>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      <form className="chatForm" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          placeholder="Nhập tin nhắn..."
          disabled={!isCurrentUserAlive}
        />
        <button className="chatButton" type="submit">
          Gửi
        </button>
      </form>
    </div>
  );
};

export default Chat;
