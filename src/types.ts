import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { type Prisma } from "@prisma/client";

export type ServerWithMembersWithProfiles = Prisma.ServerGetPayload<{
  include: {
    members: {
      include: { profile: true }
    },
  }
}>;


export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
}