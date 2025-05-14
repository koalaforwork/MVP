import React from 'react';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';

interface SuggestedPrompt {
  text: string;
  icon?: string;
}

interface ChatWelcomeProps {
  username?: string;
  description?: string;
  suggestedPrompt?: SuggestedPrompt;
  className?: string;
  onPromptClick?: (prompt: string) => void;
}

const ChatWelcome = ({
  username = "User",
  description = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam",
  suggestedPrompt = { text: "How am I doing today?", icon: "lightbulb" },
  className,
  onPromptClick
}: ChatWelcomeProps) => {
  return (
    <div className={cn("flex flex-col items-start md:items-center max-w-[644px] mx-auto gap-12 md:gap-12 px-2 py-4 md:p-4", className)}>
      {/* Greeting Section - responsive for mobile and desktop */}
      <div className="flex flex-col items-start md:items-center gap-4 md:gap-5 w-full max-w-[335px] md:max-w-[584px]">
        <h2 className="w-full text-left md:text-center text-[24px] md:text-[28px] leading-[32px] md:leading-[38px] tracking-[-0.015em] font-medium md:font-semibold font-['Inter'] text-[#323539]">
          Hey {username}
        </h2>
        <p className="w-full max-w-[335px] md:max-w-[579px] text-left md:text-center text-[16px] leading-[24px] tracking-[-0.01em] font-normal font-['Inter'] text-[#858C95]">
          {description}
        </p>
      </div>
      
      {/* Single Suggested Prompt */}
      <div className="flex justify-start md:justify-center w-full max-w-[335px] md:max-w-none">
        <div 
          className="flex flex-col items-start p-[11.31px] gap-[8.49px] w-full md:w-[188.1px] h-[84.4px] md:h-[118.8px] rounded-[18.39px] border-[1.41px] border-[#F1F1F1] cursor-pointer hover:shadow-sm transition-shadow bg-white"
          onClick={() => onPromptClick && onPromptClick(suggestedPrompt.text)}
        >
          {suggestedPrompt.icon === "lightbulb" && (
            <div className="w-[28.29px] h-[28.29px] relative">
              <Lightbulb size={28} className="text-[#E1C441]" />
            </div>
          )}
          <p className="text-start text-[16.97px] leading-[150%] tracking-[0.01em] font-normal font-['Helvetica'] text-[#6C6C6C] max-w-[312.37px] w-full">
            {suggestedPrompt.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWelcome;
