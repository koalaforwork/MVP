import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp?: Date;
  userAvatar?: string;
  username?: string;
  className?: string;
}

const ChatBubble = ({
  content,
  sender,
  timestamp,
  userAvatar,
  username = "User",
  className
}: ChatBubbleProps) => {
  const isUser = sender === 'user';
  
  return (
    <div className={cn(
      "flex w-full max-w-[640px] gap-4 mb-4",
      isUser ? "flex-row-reverse justify-start ml-auto" : "flex-row",
      className
    )}>
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
        {isUser ? (
          <img 
            src={userAvatar || "/icons/koala.png"} 
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/icons/koala.png";
            }}
          />
        ) : (
          <img 
            src="/icons/koala.png" 
            alt="Koala Assistant"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/icons/koala.png";
            }}
          />
        )}
      </div>
      
      {/* Message Bubble */}
      <div className={cn(
        "flex-grow max-w-[592px] p-4 rounded-2xl bg-white",
        isUser ? "text-right" : "text-left"
      )}>
        <p className={cn(
          "font-['Helvetica'] font-normal text-[13px] leading-[22px] text-[#484848]",
          isUser ? "text-right" : "text-left"
        )}>
          {content}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
