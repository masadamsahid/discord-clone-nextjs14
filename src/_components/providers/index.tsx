"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { io as ClientIO } from "socket.io-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 

import CreateServerModal from "@/_components/modals/create-server-modal";
import InviteModal from "@/_components/modals/invite-modal";
import EditServerModal from "@/_components/modals/edit-server-modal";
import MembersModal from "@/_components/modals/members-modal";
import CreateChannelModal from "@/_components/modals/create-channel-modal";
import LeaveServerModal from "@/_components/modals/leave-server-modal";
import DeleteServerModal from "@/_components/modals/delete-server-modal";
import DeleteChannelModal from "@/_components/modals/delete-channel-modal";
import EditChannelModal from "@/_components/modals/edit-channel-modal";
import MessageFileModal from "@/_components/modals/message-file-modal";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


export const ModalProvider = () => {
  
  const [isMounted, seTisMounted] = useState(false);
  useEffect(() => {
    seTisMounted(true);
  }, []);
  if(!isMounted) return null;
  
  return (
    <>
      <CreateServerModal/>
      <InviteModal/>
      <EditServerModal/>
      <MembersModal/>
      <CreateChannelModal/>
      <LeaveServerModal/>
      <DeleteServerModal/>
      <DeleteChannelModal/>
      <EditChannelModal/>
      <MessageFileModal/>
    </>
  );
}

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
}

type SocketProviderProps = {
  children: React.ReactNode;
}

export const SocketProvider = ({ children, ...props }: SocketProviderProps) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    
    socketInstance.on("connect", () => {
      setIsConnected(true);
    });
    
    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    }
  }, []);
  
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

type QueryProviderProps = {
  children: React.ReactNode;
};

export const QueryProvider = ({ children, ...props }: QueryProviderProps) => {
  const [queryClient, setQueryClient] = useState(() => new QueryClient());
  
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}


