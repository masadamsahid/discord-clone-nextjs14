import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getOrCreateConversation } from "@/lib/conversations";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import ChatHeader from "@/_components/chat/chat-header";
import ChatMessages from "@/_components/chat/chat-messages";
import ChatInput from "@/_components/chat/chat-input";
import MediaRoom from "@/_components/media-room";

type Props = {
  params: { serverId: string, memberId: string };
  searchParams: { video?: boolean };
}

const MemberlIdPage = async ({ params, searchParams, ...props }: Props) => {
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
      {searchParams.video && (
        <MediaRoom
          chatId={conversation.id}
          video
          audio
        />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            name={otheMember.profile.name}
            member={currentMember}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otheMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
}

export default MemberlIdPage;