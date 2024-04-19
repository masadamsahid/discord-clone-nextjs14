import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";

import ServerHeader from "@/_components/server/server-header";
import ServerSearch from "@/_components/server/server-search";

import { ScrollArea } from "@/_components/ui/scroll-area";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4"/>,
  [ChannelType.AUDIO]: <Mic className="mr-2 size-4"/>,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4"/>,
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="size-4 mr-2 text-indigo-500"/>,
  [MemberRole.ADMIN]: <ShieldAlert className="size-4 mr-2 text-rose-500"/>,
}

type ServerSidebarProps = {
  serverId: string;
}

const ServerSidebar = async ({ serverId, ...props }: ServerSidebarProps) => {
  
  const profile = await currentProfile();
  if(!profile) return redirect("/");
  
  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: {
        orderBy: { createdAt: "asc" },
      },
      members: {
        include: { profile: true },
        orderBy: { role: "asc" },
      },
    },
  });
  
  const textChannels = server?.channels.filter((c) => c.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter((c) => c.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter((c) => c.type === ChannelType.VIDEO);
  
  const members = server?.members.filter(m => m.profileId !== profile.id);
  
  if(!server) return redirect("/");  
  
  const role = server.members.find(m => m.profileId === profile.id)?.role;
  
  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role}/>
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((c) => ({ id: c.id, name: c.name, icon: iconMap[c.type] })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((c) => ({ id: c.id, name: c.name, icon: iconMap[c.type] })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((c) => ({ id: c.id, name: c.name, icon: iconMap[c.type] })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((m) => ({ id: m.id, name: m.profile.name, icon: roleIconMap[m.role] })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

export default ServerSidebar;