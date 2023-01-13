import prisma from "../utils/prisma.connection";
import { UserBasicInfo } from "./user.service";

export interface ClientName {
  name: string;
}

export interface Client extends ClientName {
  id: string;
  type: string;
  cashBalance: number;
  equityBalance: number;
  fixedIncomeBal: number;
  userList?: UserBasicInfo[];
}

//* Services
export const listClients = async (): Promise<Client[]> => {
  return prisma.client.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      cashBalance: true,
      equityBalance: true,
      fixedIncomeBal: true,
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

export const getClient = async (id: string): Promise<Client | null> => {
  return prisma.client.findUnique({
    where: {
      id,
    },
    include: {
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
  const { name, type, cashBalance, equityBalance, fixedIncomeBal } = client;
  return prisma.client.create({
    data: {
      name,
      type,
      cashBalance,
      equityBalance,
      fixedIncomeBal,
    },
    select: {
      id: true,
      name: true,
      type: true,
      cashBalance: true,
      equityBalance: true,
      fixedIncomeBal: true,
    },
  });
};

export const updateClient = async (
  client: Omit<Client, "id">,
  id: string
): Promise<Client> => {
  const { name, type, cashBalance, equityBalance, fixedIncomeBal } = client;
  return prisma.client.update({
    where: {
      id,
    },
    data: {
      name,
      type,
      cashBalance,
      equityBalance,
      fixedIncomeBal,
    },
    select: {
      id: true,
      name: true,
      type: true,
      cashBalance: true,
      equityBalance: true,
      fixedIncomeBal: true,
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
