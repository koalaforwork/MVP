import React from 'react';
import { cn } from '@/lib/utils';
import ChatWelcome from './chatwelcome';
import ChatInput from './chatInput';

interface ChatContainerProps {
  className?: string;
  username?: string;
  welcomeDescription?: string;
  suggestedPrompt?: { text: string; icon?: string };
  onPromptClick?: (prompt: string) => void;
  onSendMessage?: (message: string) => void;
}

const ChatContainer = ({
  className,
  username = "User",
  welcomeDescription = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam",
  suggestedPrompt = { text: "How am I doing today?", icon: "lightbulb" },
  onPromptClick,
  onSendMessage = (message) => console.log("Message sent:", message)
}: ChatContainerProps) => {
  return (
    <div className={cn(
      "flex flex-col w-full", 
      "md:max-w-[644px] md:h-[333.8px] md:mx-auto md:justify-between",
      className
    )}>
      <div className="flex-grow overflow-y-auto">
        <ChatWelcome
          username={username}
          description={welcomeDescription}
          suggestedPrompt={suggestedPrompt}
          onPromptClick={onPromptClick}
        />
      </div>
      <div className="mt-auto">
        <ChatInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;
