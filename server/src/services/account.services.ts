import { Account } from "@prisma/client";
import prisma from "../utils/prisma.connection";

//* Services
export const listAccount = async (): Promise<Account[]> => {
  return prisma.account.findMany({
    include: {
      client: true,
      trade: true,
    },
  });
};

export const getAccountById = async (id: string): Promise<Account | null> => {
  return prisma.account.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      trade: true,
    },
  });
};

export const createAccount = async (
  account: Omit<Account, "id">
): Promise<Account> => {
  const { cashBalance, equityBalance, fixedIncomeBal, clientId } = account;
  return prisma.account.create({
    data: {
      cashBalance,
      equityBalance,
      fixedIncomeBal,
      clientId,
    },
    include: {
      client: true,
      trade: true,
    },
  });
};

export const updateAccount = async (
  account: Omit<Account, "id">,
  id: string
): Promise<Account> => {
  const { cashBalance, equityBalance, fixedIncomeBal } = account;
  return prisma.account.update({
    where: {
      id,
    },
    data: {
      cashBalance,
      equityBalance,
      fixedIncomeBal,
    },
    include: {
      client: true,
      trade: true,
    },
  });
};

export const deleteAccount = async (id: string): Promise<void> => {
  await prisma.account.delete({
    where: {
      id,
    },
  });
};
