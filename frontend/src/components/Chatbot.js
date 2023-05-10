import ChatBot from 'react-chatbot-kit';
import config from '../config';
import MessageParser from '../MessageParser';
import ActionProvider from '../ActionProvider';
import "react-chatbot-kit/build/main.css";
import React, { useState } from 'react';
function Chatbot() {
    const [showChat, setShowChat] = useState(false);
    const toggleChat = () => {
        setShowChat(!showChat);
    };

  return (
    <div className="chatbot">
         {showChat && (
                <ChatBot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                />
            )}
            <button onClick={toggleChat}>
                {showChat ? 'Close chat' : 'Open chat'}
            </button>
    
    </div>
  );
}

export default Chatbot;
