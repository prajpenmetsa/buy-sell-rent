import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Navbar from './Navbar';


const genAI = new GoogleGenerativeAI("AIzaSyBeF00LHqn4BobMADnxLXCpccmLxHuR9cs");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Buy Sell Rent assistant powered by Gemini AI. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    startNewChat();
  }, []);
  
  
  const startNewChat = async () => {
    try {
      chatRef.current = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              { text: "You are a helpful assistant for the IIIT Buy-Sell platform. You help users with buying and selling items, answering questions about the platform, and providing guidance on using the website." }
            ]
          },
          {
            role: "model",
            parts: [
              { text: "I understand that I'm an assistant for the IIIT Buy-Sell platform. I'll help users with:\n1. Buying and selling items\n2. Platform navigation\n3. Payment processes\n4. General inquiries\nPlease feel free to ask any questions about the platform." }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const getBotResponse = async (userMessage) => {
    try {
      const result = await chatRef.current.sendMessage(userMessage);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting bot response:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try again later or contact support if the issue persists.";
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getBotResponse(input);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, { 
        text: "I apologize, but I'm having trouble responding right now. Please try again later.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.header}>Chat Support</h2>
        
        
        <div style={styles.chatContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.isBot ? 'text-left' : 'text-right'}`}
            >
              <div
                style={{
                  ...styles.message,
                  ...(message.isBot ? styles.botMessage : styles.userMessage),
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-left mb-4">
              <div style={styles.loadingContainer}>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        
        <form onSubmit={handleSubmit} style={styles.inputForm}>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={styles.input}
              disabled={isLoading}
            />
            <button
              type="submit"
              style={{
                ...styles.sendButton,
                ...(isLoading && styles.sendButtonDisabled),
              }}
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '20px',
  },
  chatContainer: {
    height: 'calc(80vh - 200px)',
    overflowY: 'auto',
    padding: '20px',
    border: '1px solid #e1e1e1',
    borderRadius: '8px',
    backgroundColor: '#f8f9fa',
  },
  message: {
    display: 'inline-block',
    padding: '10px 15px',
    borderRadius: '10px',
    maxWidth: '70%',
    marginBottom: '10px',
  },
  botMessage: {
    backgroundColor: '#ffffff',
    color: '#000000',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  userMessage: {
    backgroundColor: '#a2d2ff',
    color: '#ffffff',
    float: 'right',
  },
  loadingContainer: {
    display: 'inline-block',
    padding: '10px 15px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
  },
  inputForm: {
    marginTop: '20px',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #e1e1e1',
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#a2d2ff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default Chat;
