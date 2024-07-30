"use client";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { MessagesCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  initialState: MessagesCountInfo;
}

const MessagesButton = ({ initialState }: Props) => {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessagesCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <MessageSquareIcon />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-sm font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
};

export default MessagesButton;
