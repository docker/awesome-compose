import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === '') return;
        
        const newMessage = { text: input, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.get('http://localhost:8080/ai/chat?message=' + input);
            const aiMessage = { text: response.data, sender: 'ai' };
            setMessages([...messages, newMessage, aiMessage]);
        } catch (error) {
            console.error("Error fetching AI response", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chat-header">
                <img src="ChatBot.png" alt="Chatbot Logo" className="chat-logo" />
                <div className="breadcrumb">Home &gt; Chat</div>
            </div>
            <div className="chatbox">
                {messages.map((message, index) => (
                    <div key={index} className={`message-container ${message.sender}`}>
                        <img
                            src={message.sender === 'user' ? 'user-icon.png' : 'ai-assistant.png'}
                            alt={`${message.sender} avatar`}
                            className="avatar"
                        />
                        <div className={`message ${message.sender}`}>
                            {message.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="message-container ai">
                        <img src="ai-assistant.png" alt="AI avatar" className="avatar" />
                        <div className="message ai">...</div>
                    </div>
                )}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
