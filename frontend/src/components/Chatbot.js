import ChatBot from 'react-chatbot-kit';
import config from '../config';
import MessageParser from '../MessageParser';
import ActionProvider from '../ActionProvider';
import "react-chatbot-kit/build/main.css";
import React, { useState } from 'react';
import { BsRobot } from "react-icons/bs";

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
            <div className="icon-container" onClick={toggleChat}>
              <BsRobot className="icon" size={30} />
            </div>
            
    </div>
  );
}

export default Chatbot;
