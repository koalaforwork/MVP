import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CheckInRewardProps {
  className?: string;
  onClaim?: () => void;
  onClose?: () => void;
}

const CheckInReward: React.FC<CheckInRewardProps> = ({ 
  className, 
  onClaim,
  onClose 
}) => {
  const handleClaimReward = () => {
    onClaim?.();
    onClose?.();
  };

  return (
    <div className={cn("flex flex-col items-center px-4 h-full", className)}>
      <div className="w-full max-w-[327px] flex flex-col h-full">
        <div className="w-full flex flex-col items-center gap-6 mt-8">
          <p className="w-full text-[16px] font-normal font-['inter'] leading-[24px] tracking-[-0.1px] text-[#323539] text-center">
            Your Koalas have earned some leaves for helping you complete this task. Would you like to claim it?
          </p>
        </div>
        
        <div className="flex-grow flex items-center justify-center min-h-[200px]">
          <div className="w-full max-w-[280px] h-auto relative flex justify-center">
            <Image 
              src="/images/leaf.png" 
              alt="Reward Leaf" 
              width={280} 
              height={280}
              priority
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="w-full mt-4 mb-8">
          <button 
            className="w-full h-[48px] rounded-[8px] bg-[#268771] text-white font-medium py-3 px-7 flex items-center justify-center hover:bg-[#1f6b5a] transition-colors"
            onClick={handleClaimReward}
          >
            Claim reward and close task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInReward;