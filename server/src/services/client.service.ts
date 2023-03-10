import { Prisma } from "@prisma/client";
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

//* GET all clients by accountRepId
const getClientsByAccountRepId = Prisma.validator<Prisma.ClientArgs>()({
  select: {
    id: true,
    name: true,
    type: true,
    account: {
      select: {
        cashBalance: true,
        equityBalance: true,
        fixedIncomeBal: true,
        trade: true,
      },
    },
    userList: {
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    },
  },
});

type GetClientsByAccountRepId = Prisma.ClientGetPayload<
  typeof getClientsByAccountRepId
>;

export const listClientsByRepId = async (
  id: string
): Promise<GetClientsByAccountRepId[]> => {
  return prisma.client.findMany({
    where: {
      accountRepId: id,
    },
    select: {
      id: true,
      name: true,
      type: true,
      account: {
        select: {
          cashBalance: true,
          equityBalance: true,
          fixedIncomeBal: true,
          trade: true,
        },
      },
      userList: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const getClientById = async (
  id: string
): Promise<GetClientsByAccountRepId | null> => {
  return prisma.client.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      type: true,
      account: {
        select: {
          cashBalance: true,
          equityBalance: true,
          fixedIncomeBal: true,
          trade: true,
        },
      },
      userList: {
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
  const { name, type, accountRepId } = client;
  return prisma.client.create({
    data: {
      name,
      type,
      accountRepId,
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
