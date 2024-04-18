import { type Prisma } from "@prisma/client";

export type ServerWithMembersWithProfiles = Prisma.ServerGetPayload<{
  include: {
    members: {
      include: { profile: true }
    },
  }
}>;