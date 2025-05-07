import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  title?: string;
  username?: string;
  avatarUrl?: string;
  avatarLoading?: boolean;
  className?: string;
  onAvatarUpdate?: (file: File) => Promise<void>;
}

const Navbar = ({
  title = "Today",
  username = "Valerie",
  avatarUrl = "/icons/Avatar.png",
  avatarLoading = false,
  className,
  onAvatarUpdate,
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
        console.error("Error uploading avatar:", error);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "w-full h-[70px] border-b border-gray-200 flex items-center",
        className
      )}
    >
      <div className="w-full flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center gap-1">
          <h1 className="text-[24px] font-semibold leading-[100%] tracking-[-0.1px] text-[#323539]">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <div
              className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden"
              onClick={handleAvatarClick}
            >
              {avatarLoading ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <svg
                    className="animate-spin h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <img
                  src={avatarUrl || "/default-avatar.png"}
                  alt={`${username}'s avatar`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/default-avatar.png";
                  }}
                />
              )}
            </div>
            <span className="hidden md:inline text-[14px] font-semibold leading-[20px] tracking-[-0.1px] text-[#323539]">
              {username}
            </span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            {showUploadMenu && onAvatarUpdate && (
              <div className="absolute top-12 right-0 bg-white shadow-md rounded-lg p-1 z-10 w-52 border border-gray-100 animate-in fade-in slide-in-from-top-5 duration-200">
                <div className="py-1.5 px-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Profile Photo
                </div>
                <button
                  className="w-full text-left mt-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2 transition-colors"
                  onClick={triggerFileInput}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Upload new photo
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-colors"
                  onClick={() => setShowUploadMenu(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;