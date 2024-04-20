"use client";

import { useSocket } from "@/_components/providers";
import { Badge } from "@/_components/ui/badge";

type SocketIndicatorProps = {}

const SocketIndicator = ({ ...props }: SocketIndicatorProps) => {
  const { isConnected } = useSocket();
  if(!isConnected) return (
    <Badge variant='outline' className="bg-yellow-600 text-white border-none">
      Fallback: Polling every 1s
    </Badge>
  );
  
  return (
    <Badge variant='outline' className="bg-emerald-600 text-white border-none">
      Live: Real-time updates
    </Badge>
  );
}

export default SocketIndicator;