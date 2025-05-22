import React from "react";
import CheckInContainer from "./CheckInContainer";

interface CheckInPageProps {
  isOpen: boolean;
  username?: string;
  userAvatar?: string;
  onClose: () => void;
}

const CheckInPage: React.FC<CheckInPageProps> = ({
  isOpen,
  username,
  userAvatar,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="fixed inset-0 md:fixed md:left-0 md:top-0 md:w-[375px] md:h-screen z-50">
        <CheckInContainer
          username={username}
          userAvatar={userAvatar}
          onClose={onClose}
        />
      </div>
    </>
  );
};

export default CheckInPage;