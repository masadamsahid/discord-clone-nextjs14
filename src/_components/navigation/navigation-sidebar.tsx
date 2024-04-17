import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import { Separator } from "@/_components/ui/separator";
import { ScrollArea } from "@/_components/ui/scroll-area";

import NavigationAction from "@/_components/navigation/navigation-action";
import NavigationItem from "@/_components/navigation/navigation-item";
import { ModeToggle } from "@/_components/mode-toggler";
import { UserButton } from "@clerk/nextjs";

type Props = {}

const NavigationSidebar = async (props: Props) => {
  
  const profile = await currentProfile();
  if(!profile) return redirect('/');
  
  const servers = await db.server.findMany({
    where: {
      members: {
        some: { profileId: profile.id },
      },
    },
  });
  
  
  
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
      <ScrollArea className="flex-1 w-full">
        {servers.map((s) => (
          <div key={s.id} className="mb-4">
            <NavigationItem {...s} />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle/>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "size-[48px]"
            }
          }}
        />
      </div>
    </div>
  );
}

export default NavigationSidebar;