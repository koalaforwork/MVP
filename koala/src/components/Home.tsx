import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "@tanstack/react-router";
import Navbar from "./shared/Navbar";
import ChatContainer from "./chat/chatContainer";

const Home = () => {
  const [userDbStatus, setUserDbStatus] = useState<
    "checking" | "created" | "exists" | "error" | null
  >(null);
  const [userDbError, setUserDbError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;

      if (hash && hash.includes("access_token")) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      setAuthChecked(true);
    };

    handleAuthRedirect();

    const checkAndCreateUserInDb = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (currentSession) {
        sessionStorage.setItem("user", JSON.stringify(currentSession.user));
        setSession(currentSession);

        await fetchProfilePicture(currentSession.user.id);

        setUserDbStatus("checking");
        setUserDbError(null);

        try {
          const response = await fetch("/api/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: currentSession.user.id,
              email: currentSession.user.email,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            setUserDbError(data.message || "Failed to connect to the database");
            setUserDbStatus("error");
          } else {
            if (data.message.includes("created")) {
              setUserDbStatus("created");
            } else {
              setUserDbStatus("exists");
            }
          }
        } catch (apiError: any) {
          setUserDbError(
            apiError.message || "Failed to connect to the database"
          );
          setUserDbStatus("error");
        }
      } else {
        setUserDbStatus(null);
        navigate({ to: "/signup" });
      }
    };

    checkAndCreateUserInDb();
  }, []);

  const fetchProfilePicture = async (userId: string) => {
    try {
      setAvatarLoading(true);

      const { data: fileList, error: listError } = await supabase.storage
        .from("avatars")
        .list(userId);

      if (listError) {
        setAvatarLoading(false);
        return;
      }

      if (
        !fileList ||
        fileList.length === 0 ||
        !fileList.some((file) => file.name === "avatar")
      ) {
        setAvatarLoading(false);
        return;
      }

      const { data, error } = await supabase.storage
        .from("avatars")
        .download(`${userId}/avatar`);

      if (error) {
        setAvatarLoading(false);
        return;
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarUpdate = async (file: File) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setUploadError("You must be logged in to update your avatar");
      return;
    }

    try {
      setUploadError(null);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(`${session.user.id}/avatar`, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      await fetchProfilePicture(session.user.id);
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload avatar");
    }
  };

  const handlePromptClick = (prompt: string) => {
    console.log("Prompt clicked:", prompt);
    // TODO: handle prompt logic
  };

  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);
    // TODO: handle message sending logic
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        username={session?.user?.user_metadata?.name || "User"}
        avatarUrl={avatarUrl}
        avatarLoading={avatarLoading}
        onAvatarUpdate={handleAvatarUpdate}
      />

      {/* This container takes up the full height on mobile and centers content on desktop */}
      <div className="flex-grow flex flex-col md:items-center md:justify-center">
        {/* On mobile: full height, On desktop: slightly taller to fit everything */}
        <div className="flex-grow flex flex-col md:flex-grow-0 md:h-[380px] w-full max-w-[335px] md:max-w-[644px] mx-auto">
          <ChatContainer
            username={session?.user?.user_metadata?.name || "Valerie"}
            welcomeDescription="Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam"
            suggestedPrompt={{
              text: "How am I doing today?",
              icon: "lightbulb",
            }}
            onPromptClick={handlePromptClick}
            onSendMessage={handleSendMessage}
            className="flex-grow flex flex-col"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
