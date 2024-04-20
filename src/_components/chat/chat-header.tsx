import { Hash } from "lucide-react";
import MobileToggle from "@/_components/mobile-toggle";

type ChatHeaderProps = {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
}

const ChatHeader = ({ serverId, name, type, ...props }: ChatHeaderProps) => {
  
  
  return (
    <div className="text-base font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} className="md:hidden"/>
      {type === "channel" && (
        <Hash className="size-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
      )}
      <p className="font-semibold text-base text-black dark:text-white">
        {name}
      </p>
    </div>
  );
}

export default ChatHeader;