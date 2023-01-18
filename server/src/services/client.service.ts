import { Client } from "../../../node_modules/.prisma/client";
import prisma from "../utils/prisma.connection";

//* Services
export const listClients = async (): Promise<Client[]> => {
  return prisma.client.findMany({
    include: {
      account: {
        select: {
          cashBalance: true,
          equityBalance: true,
          fixedIncomeBal: true,
        },
      },
      userList: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      accountRep: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const getClientById = async (id: string): Promise<Client | null> => {
  return prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      account: {
        select: {
          cashBalance: true,
          equityBalance: true,
          fixedIncomeBal: true,
        },
      },
      userList: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      accountRep: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const createClient = async (
  client: Omit<Client, "id">
): Promise<Client> => {
  const { name, type } = client;
  return prisma.client.create({
    data: {
      name,
      type,
    },
    include: {
      account: {
        select: {
          cashBalance: true,
          equityBalance: true,
          fixedIncomeBal: true,
        },
      },
      userList: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      accountRep: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const createClientWithAcc = async (
  client: Omit<Client, "id">
): Promise<Client> => {
  const { name, type } = client;
  return prisma.client.create({
    data: {
      name,
      type,
      account: {
        create: {
          cashBalance: 0,
          equityBalance: 0,
          fixedIncomeBal: 0,
        },
      },
    },
    include: {
      account: {
        select: {
          cashBalance: true,
          equityBalance: true,
          fixedIncomeBal: true,
        },
      },
      userList: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      accountRep: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const updateClientById = async (
  client: Omit<Client, "id">,
  id: string
): Promise<Client> => {
  const { name, type, accountRepId } = client;
  return prisma.client.update({
    where: {
      id,
    },
    data: {
      name,
      type,
      accountRepId,
    },
    include: {
      account: {
        select: {
          cashBalance: true,
          equityBalance: true,
          fixedIncomeBal: true,
        },
      },
      userList: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      accountRep: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const deleteClient = async (id: string): Promise<void> => {
  await prisma.client.delete({
    where: {
      id,
    },
  });
};
