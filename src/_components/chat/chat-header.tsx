import { Hash } from "lucide-react";
import MobileToggle from "@/_components/mobile-toggle";
import UserAvatar from "@/_components/user-avatar";
import SocketIndicator from "@/_components/socket-indicator";
import ChatVideoButton from "@/_components/chat/chat-video-button";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl, ...props }: ChatHeaderProps) => {
  
  
  return (
    <div className="text-base font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} className="md:hidden"/>
      {type === "channel" && (
        <Hash className="size-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
      )}
      {type === "conversation" && (
        <UserAvatar
          src={imageUrl}
          className="size-8 md:size-8 mr-2"
        />
      )}
      <p className="font-semibold text-base text-black dark:text-white">
        {name}
      </p>
      <div className="ml-auto flex items-center">
        {type === "conversation" && (
          <ChatVideoButton/>
        )}
        <SocketIndicator/>
      </div>
    </div>
  );
}

export default ChatHeader;