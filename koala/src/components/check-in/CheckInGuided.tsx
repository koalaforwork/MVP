import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CheckInGuidedProps {
  className?: string;
  onComplete?: () => void;
}

const CheckInGuided: React.FC<CheckInGuidedProps> = ({ className, onComplete }) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

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

  const subtasks = [
    { id: 'foundational-needs', title: 'Foundational needs check', duration: '1 mins' },
    { id: 'somatic-body-scan', title: 'Somatic body scan', duration: '2 mins' },
    { id: 'regular-activity', title: 'Regular activity (optional)', duration: '' },
  ];

  return (
    <div className={cn("flex flex-col items-center px-4 h-full", className)}>
      <div className="w-full max-w-[327px] flex flex-col h-full">
        <div className="w-full flex flex-col items-center gap-6 mt-8">
          <p className="w-full text-[16px] font-normal font-['inter'] leading-[24px] tracking-[-0.1px] text-[#323539]">
            A guided exercise to understand your capacity and get you started with your work day.
          </p>
          
          <div className="w-full flex justify-center items-center py-8">
            <div className="w-[200px] h-[200px] relative">
              <Image 
                src="/images/cup.png" 
                alt="Cup" 
                width={200} 
                height={200}
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="flex-grow min-h-[40px]"></div>
        
        <div className="w-full flex flex-col gap-4 mb-6">
          <h3 className="w-full text-[16px] font-semibold font-['inter'] leading-[20px] tracking-[-0.1px] text-[#323539]">
            Subtasks
          </h3>
          
          <div className="w-full flex flex-col gap-4">
            {subtasks.map((item) => {
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
                      {item.duration && (
                        <span className={cn(
                          "font-inter font-normal text-[14px] leading-[20px] tracking-[-0.1px]",
                          isCompleted ? "text-[#C1C4C7]" : "text-[#323539]"
                        )}>
                          {item.duration}
                        </span>
                      )}
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
            className="w-full h-[48px] rounded-[8px] bg-[#BDC5CF] text-white font-medium py-3 px-7 flex items-center justify-center hover:bg-[#A8B3BF] transition-colors"
            onClick={onComplete}
          >
            End task
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInGuided;