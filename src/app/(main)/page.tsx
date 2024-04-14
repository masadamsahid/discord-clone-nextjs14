import { ModeToggle } from "@/_components/mode-toggler";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/"/>
      <ModeToggle/>
    </div>
  );
}
