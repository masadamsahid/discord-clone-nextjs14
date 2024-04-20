import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type Props = {
  params: { serverId: string }
}

const ServerHomePage = async ({ params }: Props) => {
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: { profileId: profile.id },
      },
    },
    include: {
      channels: {
        where: { name: "general" },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  
  const initialChannel = server?.channels[0];
  if(initialChannel?.name !== "general") return <h1>You should be redirected to the initial `#general` channel</h1>;
  
  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
}

export default ServerHomePage;