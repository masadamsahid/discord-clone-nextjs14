"use client";

import qs from 'query-string';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Video, VideoOff } from 'lucide-react';

import ActionTooltip from '@/_components/action-tooltip';

type ChatVideoButtonProps = {}

const ChatVideoButton = (props: ChatVideoButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const isVideo = searchParams?.get("video");
  
  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname || "",
      query: {
        video: isVideo ? undefined : true,
      }
    }, { skipNull: true });
    
    router.push(url);
  }
  
  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";
  
  return (
    <ActionTooltip label={tooltipLabel} side='bottom'>
      <button onClick={onClick} className='hover:opacity-75 transition mr-4'>
        <Icon className="size-6 to-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
}

export default ChatVideoButton;