import { Avatar, AvatarImage } from "@/_components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  src?: string;
  className?: string;
}

const UserAvatar = ({ src, className, ...props }: UserAvatarProps) => {
  
  return (
    <Avatar className={cn("size-7 md:size-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
}

export default UserAvatar;