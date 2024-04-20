"use client"

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

import CreateServerModal from "@/_components/modals/create-server-modal";
import InviteModal from "@/_components/modals/invite-modal";
import EditServerModal from "@/_components/modals/edit-server-modal";
import MembersModal from "@/_components/modals/members-modal";
import CreateChannelModal from "@/_components/modals/create-channel-modal";
import LeaveServerModal from "@/_components/modals/leave-server-modal";
import DeleteServerModal from "@/_components/modals/delete-server-modal";
import DeleteChannelModal from "@/_components/modals/delete-channel-modal";
import EditChannelModal from "@/_components/modals/edit-channel-modal";

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
    </>
  );
}

