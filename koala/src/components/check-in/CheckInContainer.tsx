import React, { useState } from "react";
import { cn } from "@/lib/utils";
import CheckInGuided from "./CheckInGuided";
import CheckInFlow from "./CheckInFlow";
import CheckInReward from "./CheckInReward";

interface CheckInContainerProps {
  className?: string;
  username?: string;
  userAvatar?: string;
  onClose?: () => void;
}

const CheckInContainer: React.FC<CheckInContainerProps> = ({
  className,
  username,
  userAvatar,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<'guided' | 'tasks' | 'reward'>('guided');

  const handleGuidedComplete = () => {
    setCurrentStep('reward');
  };

  const handleRewardClaim = () => {
    setCurrentStep('tasks');
  };

  const handleTasksComplete = () => {
    onClose?.();
  };

  return (
    <div
      className={cn(
        "w-full h-full",
        "bg-gradient-to-b from-[#F5FCFF] to-[#F6FDFF]",
        "flex flex-col",
        "overflow-hidden",
        className
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h2 className="text-[24px] font-semibold font-['inter'] leading-[100%] tracking-[-0.1px] text-[#323539]">
          Check In
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {currentStep === 'guided' && (
          <CheckInGuided onComplete={handleGuidedComplete} className="py-4" />
        )}
        {currentStep === 'reward' && (
          <CheckInReward 
            onClaim={handleRewardClaim} 
            onClose={() => setCurrentStep('tasks')}
            className="py-4" 
          />
        )}
        {currentStep === 'tasks' && (
          <CheckInFlow onComplete={handleTasksComplete} className="py-4" />
        )}
      </div>
    </div>
  );
};

export default CheckInContainer;