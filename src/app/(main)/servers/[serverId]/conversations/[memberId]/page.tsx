import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getOrCreateConversation } from "@/lib/conversations";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import ChatHeader from "@/_components/chat/chat-header";

type Props = {
  params: { serverId: string, memberId: string };
}

const MemberlIdPage = async ({ params, ...props }: Props) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();
  
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: { profile: true },
  });
  if (!currentMember) return redirect("/");
  
  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
  if (!conversation) return redirect(`/servers/${params.serverId}`);
  
  const { memberOne, memberTwo } = conversation;
  const otheMember = memberOne.profileId === profile.id ? memberTwo : memberOne;
  
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otheMember.profile.imageUrl}
        name={otheMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  );
}

export default MemberlIdPage;