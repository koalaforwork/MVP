import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  title?: string;
  username?: string;
  avatarUrl?: string;
  className?: string;
  onAvatarUpdate?: (file:File) => Promise<void>;
}

const Navbar = ({ 
  title = "Today",
  username = "Valerie", 
  avatarUrl = "/icons/Avatar.png", 
  className,
  onAvatarUpdate 
}: NavbarProps) => {
    const [showUploadMenu, setShowUploadMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        if (onAvatarUpdate) {
            setShowUploadMenu(true);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onAvatarUpdate) {
          try {
            await onAvatarUpdate(file);
            setShowUploadMenu(false);
          } catch (error) {
            console.error('Error uploading avatar:', error);
          }
        }
      };

      const triggerFileInput = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };
      
  return (
    <div className={cn("w-full h-[70px] border-b border-gray-200 flex items-center", className)}>
      <div className="w-full flex justify-between items-center px-4 md:px-8">
        {/* Page title text */}
        <div className="flex items-center gap-1">
          <h1 className="text-[24px] font-semibold leading-[100%] tracking-[-0.1px] text-[#323539]">
            {title}
          </h1>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={avatarUrl} 
                alt={`${username}'s avatar`} 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden md:inline text-[14px] font-semibold leading-[20px] tracking-[-0.1px] text-[#323539]">
              {username}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
