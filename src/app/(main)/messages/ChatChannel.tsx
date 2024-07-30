import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

interface Props {
  open: boolean;
  openSidebar: () => void;
}

const ChatChannel = ({ open, openSidebar }: Props) => {
  return (
    <div className={cn("w-full", !open && "hidden md:block")}>
      <Channel>
        <Window>
          <CustomChanelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

export default ChatChannel;

interface HeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

const CustomChanelHeader = ({ openSidebar, ...props }: HeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
};
