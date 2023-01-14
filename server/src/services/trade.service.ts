import { Trade } from "@prisma/client";
import prisma from "../utils/prisma.connection";

//* Services
export const listTrade = async (): Promise<Trade[]> => {
  return prisma.trade.findMany({
    include: {
      custodyAccount: true,
    },
  });
};

export const getTrade = async (id: string): Promise<Trade | null> => {
  return prisma.trade.findUnique({
    where: {
      id,
    },
    include: {
      custodyAccount: true,
    },
  });
};

export const createTrade = async (trade: Omit<Trade, "id">): Promise<Trade> => {
  const {
    tradeDate,
    settlementDate,
    stockType,
    settlementAmt,
    position,
    custodyAccountId,
  } = trade;
  return prisma.trade.create({
    data: {
      tradeDate,
      settlementDate,
      stockType,
      settlementAmt,
      position,
      custodyAccountId,
    },
    include: {
      custodyAccount: true,
    },
  });
};

export const updateTrade = async (
  trade: Omit<Trade, "id">,
  id: string
): Promise<Trade> => {
  const {
    tradeDate,
    settlementDate,
    stockType,
    settlementAmt,
    position,
    onTime,
    custodyAccountId,
  } = trade;
  return prisma.trade.update({
    where: {
      id,
    },
    data: {
      tradeDate,
      settlementDate,
      stockType,
      settlementAmt,
      position,
      onTime,
      custodyAccountId,
    },
    include: {
      custodyAccount: true,
    },
  });
};

export const deleteTrade = async (id: string): Promise<void> => {
  await prisma.trade.delete({
    where: {
      id,
    },
  });
};
