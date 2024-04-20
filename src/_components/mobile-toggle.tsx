import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

import { Sheet, SheetContent, SheetTrigger } from "@/_components/ui/sheet";
import { Button } from "@/_components/ui/button";
import NavigationSidebar from "@/_components/navigation/navigation-sidebar";
import ServerSidebar from "@/_components/server/server-sidebar";

type MobileToggleProps = {
  className: string;
  serverId: string;
}

const MobileToggle = ({ serverId, className, ...props }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className={cn("", className)}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar/>
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileToggle;