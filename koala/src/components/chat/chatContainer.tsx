import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ChatWelcome from './chatwelcome';
import ChatInput from './chatInput';
import ChatBubble from './chatBubble';

// Define message type
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatContainerProps {
  className?: string;
  username?: string;
  userAvatar?: string;
  welcomeDescription?: string;
  suggestedPrompt?: { text: string; icon?: string };
  onPromptClick?: (prompt: string) => void;
  onSendMessage?: (message: string) => void;
}

const ChatContainer = ({
  className,
  username = "User",
  userAvatar,
  welcomeDescription = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam",
  suggestedPrompt = { text: "How am I doing today?", icon: "lightbulb" },
  onPromptClick,
  onSendMessage
}: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Handle prompt click
  const handlePromptClick = async (prompt: string) => {
    if (onPromptClick) onPromptClick(prompt);
    
    // Hide welcome screen
    setShowWelcome(false);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Morning ${username}, let's see how you're doing today. 💤 How did you sleep last night? Just share how it felt — no need to track numbers.`,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  // Handle sending a message
  const handleSendMessage = async (message: string) => {
    if (onSendMessage) onSendMessage(message);
    
    // Hide welcome screen
    setShowWelcome(false);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I've processed your message. Here's my response to: " + message,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "flex flex-col w-full", 
        "md:max-w-[644px] md:mx-auto",
        messages.length > 0 ? "justify-start" : "justify-center",
        className
      )}
      style={{
        minHeight: showWelcome ? '380px' : 'auto',
        maxHeight: '80vh', // Limit maximum height to 80% of viewport height
      }}
    >
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        {showWelcome ? (
          <ChatWelcome
            username={username}
            description={welcomeDescription}
            suggestedPrompt={suggestedPrompt}
            onPromptClick={handlePromptClick}
          />
        ) : (
          <div className="flex flex-col p-4 space-y-4">
            {messages.map(message => (
              <ChatBubble
                key={message.id}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
                userAvatar={userAvatar}
                username={username}
              />
            ))}
            
            {isLoading && (
              <div className="flex space-x-2 p-2 self-start bg-white rounded-lg ml-12">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="mt-auto">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;
