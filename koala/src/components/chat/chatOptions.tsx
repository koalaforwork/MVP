import React from 'react';
import { cn } from '@/lib/utils';

interface ChatOptionsProps {
  options: string[];
  onOptionSelect: (option: string) => void;
  className?: string;
}

const ChatOptions = ({ options, onOptionSelect, className }: ChatOptionsProps) => {
  if (!options || options.length === 0) return null;
  
  return (
    <div 
      className={cn(
        "flex flex-col items-end gap-2 max-w-[440px]",
        className
      )}
    >
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onOptionSelect(option)}
          className={cn(
            "bg-[#F0F0F0] rounded-[20px] px-4 py-[15px]",
            "font-['Helvetica'] font-normal text-[13px] leading-[21px] text-black",
            "hover:bg-gray-200 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-gray-300",
            "w-auto"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ChatOptions;
