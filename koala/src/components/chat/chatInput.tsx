import React from 'react';
import { cn } from '@/lib/utils';
import { Paperclip, ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const ChatInput = ({
  onSendMessage,
  placeholder = "Message Koala",
  className,
  disabled = false
}: ChatInputProps) => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className={cn("w-full px-2 md:px-0 pb-4", className)}>
      <form 
        onSubmit={handleSubmit}
        className="w-full h-[43px] bg-[#F6F6F6] rounded-[24px] pl-4 pr-2 md:pl-4 md:pr-2 py-2 flex items-center gap-2 md:gap-2"
      >
        {/* Clip icon - moved closer to the left edge */}
        <button 
          type="button" 
          className="flex-shrink-0 flex items-center justify-center ml-2"
          disabled={disabled}
        >
          <Paperclip size={15} className="text-[#323539]" />
        </button>
        
        {/* Input field - moved closer to the clip */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-grow w-[228px] md:w-auto bg-transparent border-none outline-none text-[13px] leading-[100%] font-normal font-['Inter'] text-[#323539] placeholder:text-[#B5B5B5] ml-2"
        />
        
        {/* Send button - moved closer to the right edge and changed color to grey */}
        <button 
          type="submit" 
          disabled={disabled || !message.trim()}
          className={cn(
            "flex-shrink-0 w-[27px] h-[27px] rounded-[16px] bg-[#DEDEDE] flex items-center justify-center mr-2",
            message.trim() ? "opacity-100" : "opacity-50"
          )}
        >
          <ArrowUp size={16} className="text-[#6C6C6C]" /> {/* Changed from white to grey */}
        </button>
      </form>
      
      {/* Disclaimer text */}
      <p className="w-full text-center text-[10px] leading-[100%] font-normal font-['Helvetica'] text-[#B5B5B5] mt-2">
        Koala can make mistakes.
      </p>
    </div>
  );
};

export default ChatInput;
