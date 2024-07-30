"use client";

import { Loader2 } from "lucide-react";
import useInitializeChatClient from "./useInitializeChatClient";
import { Chat as StreamChat } from "stream-chat-react";
import ChatSidebar from "./ChatSidebar";
import ChatChannel from "./ChatChannel";
import { useTheme } from "next-themes";
import { useState } from "react";

const Chat = () => {
  const chatClient = useInitializeChatClient();
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSideBarOpen] = useState(true);

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm md:h-auto h-[70vh]">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSideBarOpen(false)}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSideBarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
};

export default Chat;
