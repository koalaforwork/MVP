import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CheckInFlowProps {
  className?: string;
  onComplete?: () => void;
}

const CheckInFlow: React.FC<CheckInFlowProps> = ({ className, onComplete }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [completedItems, setCompletedItems] = useState<string[]>(['first-check-in', 'plan-my-day']);

  const toggleItemSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const toggleItemCompletion = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedItems.includes(item)) {
      setCompletedItems(completedItems.filter(i => i !== item));
    } else {
      setCompletedItems([...completedItems, item]);
      setSelectedItems(selectedItems.filter(i => i !== item));
    }
  };

  const checkInItems = [
    { id: 'first-check-in', title: 'First check in', duration: '5 mins' },
    { id: 'plan-my-day', title: 'Plan my day', duration: '10 mins' },
    { id: 'self-advocacy', title: 'Self advocacy document', duration: '60 mins' },
    { id: 'sprint-goal', title: 'Draft sprint-goal outline for next cycle', duration: '~55 mins' },
    { id: 'close-day', title: 'Close my day', duration: '~10 mins' },
  ];

  const hasCompletedTasks = completedItems.length > 0;

  return (
    <div className={cn("flex flex-col items-center px-4 h-full", className)}>
      <div className="w-full max-w-[327px] flex flex-col h-full">
        <div className="w-full flex flex-col items-center gap-6 mt-8">
          <p className="w-full text-[16px] font-normal font-['inter'] leading-[24px] tracking-[-0.1px] text-[#323539]">
            Energy started low today, but you still showed up. Gentle wins matter.
          </p>
          
          <div className="w-full flex justify-center items-center py-4">
            <div className="w-[160px] h-[160px] relative">
              <Image 
                src="/images/suncloud.png" 
                alt="Sun and Cloud" 
                width={160} 
                height={160}
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="flex-grow min-h-[40px]"></div>
        
        <div className="w-full flex flex-col gap-4 mb-6">
          <h3 className="w-full text-[16px] font-semibold font-['inter'] leading-[20px] tracking-[-0.1px] text-[#323539]">
            Tasks
          </h3>
          
          <div className="w-full flex flex-col gap-4">
            {checkInItems.map((item) => {
              const isCompleted = completedItems.includes(item.id);
              const isSelected = selectedItems.includes(item.id);
              
              return (
                <div 
                  key={item.id}
                  className={cn(
                    "w-full h-[56px] rounded-[12px] p-3 flex items-center justify-between gap-3 cursor-pointer transition-all",
                    isSelected && !isCompleted
                      ? "border-2 border-[#268771] bg-[#C1E3DC] bg-opacity-35" 
                      : isCompleted
                        ? "border border-gray-200 bg-gray-50"
                        : "border border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="w-full flex justify-between">
                      <span className={cn(
                        "font-inter font-medium text-[14px] leading-[20px] tracking-[-0.1px]",
                        isCompleted ? "text-[#C1C4C7] line-through" : "text-[#323539]"
                      )}>
                        {item.title}
                      </span>
                      <span className={cn(
                        "font-inter font-normal text-[14px] leading-[20px] tracking-[-0.1px]",
                        isCompleted ? "text-[#C1C4C7]" : "text-[#323539]"
                      )}>
                        {item.duration}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#ECECEC] rounded-full">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          isCompleted ? "w-full bg-[#C1C4C7]" : "w-0 bg-blue-500"
                        )}
                      ></div>
                    </div>
                  </div>
                  <div 
                    className={cn(
                      "min-w-[16px] h-[16px] rounded-[4.92px] border-[1.4px] flex items-center justify-center cursor-pointer transition-all",
                      isCompleted ? "border-[#C1C4C7] bg-gray-100" : "border-[#323539] hover:border-[#268771]"
                    )}
                    onClick={(e) => toggleItemCompletion(item.id, e)}
                  >
                    {isCompleted ? (
                      <div className="w-[8px] h-[8px] bg-[#C1C4C7] rounded-[2px]"></div>
                    ) : (
                      isSelected && (
                        <div className="w-[8px] h-[8px] bg-[#323539] rounded-[2px]"></div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="w-full mt-4 mb-8">
          <button 
            className={cn(
              "w-full h-[48px] rounded-[8px] text-white font-medium py-3 px-7 flex items-center justify-center transition-colors",
              hasCompletedTasks 
                ? "bg-[#268771] hover:bg-[#1f6b5a]" 
                : "bg-[#BDC5CF] hover:bg-[#A8B3BF]"
            )}
            onClick={onComplete}
          >
            End day
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInFlow;