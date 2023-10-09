import React, { useState, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    // Send the new message to the server (WebSocket or another backend service).
    // For now, let's just add the message to the local state for testing.
    setMessages([...messages, { text: newMessage, sender: 'You' }]);
    setNewMessage('');
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
  
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };
  
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Handle incoming messages, e.g., update the chat state
      setMessages([...messages, { text: message, sender: 'Other User' }]);
    };
  
    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  
    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // The empty dependency array [] ensures this effect runs once when the component mounts
  

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="chat-message">
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
