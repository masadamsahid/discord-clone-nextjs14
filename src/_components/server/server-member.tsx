"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "@/_components/user-avatar";

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="size-4 ml-2 text-indigo-500"/>,
  [MemberRole.ADMIN]: <ShieldAlert className="size-4 ml-2 text-rose-500"/>,
}

type ServerMemberProps = {
  member: Member & { profile: Profile };
  server: Server;
}

const ServerMember = ({ member, server, ...props }: ServerMemberProps) => {
  const router = useRouter();
  const params = useParams();
  
  const icon = roleIconMap[member.role];
  
  return (
    <button
      className={cn(
        "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transit mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="size-4 md:size-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
       {member.profile.name} 
      </p>
      {icon}
    </button>
  );
}

export default ServerMember;