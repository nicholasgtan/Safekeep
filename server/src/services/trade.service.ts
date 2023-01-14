import { Prisma, Trade } from "@prisma/client";
import prisma from "../utils/prisma.connection";

const tradeWithClientName = Prisma.validator<Prisma.TradeArgs>()({
  select: {
    id: true,
    tradeDate: true,
    settlementDate: true,
    stockType: true,
    settlementAmt: true,
    position: true,
    onTime: true,
    client: {
      select: {
        name: true,
      },
    },
  },
});

type TradeWithClientName = Prisma.TradeGetPayload<typeof tradeWithClientName>;

//* Services
export const listTrade = async (): Promise<TradeWithClientName[]> => {
  return prisma.trade.findMany({
    select: {
      id: true,
      tradeDate: true,
      settlementDate: true,
      stockType: true,
      settlementAmt: true,
      position: true,
      onTime: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getTrade = async (
  id: string
): Promise<TradeWithClientName | null> => {
  return prisma.trade.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      tradeDate: true,
      settlementDate: true,
      stockType: true,
      settlementAmt: true,
      position: true,
      onTime: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const createTrade = async (
  trade: Omit<Trade, "id">
): Promise<TradeWithClientName> => {
  const {
    tradeDate,
    settlementDate,
    stockType,
    settlementAmt,
    position,
    clientId,
  } = trade;
  return prisma.trade.create({
    data: {
      tradeDate,
      settlementDate,
      stockType,
      settlementAmt,
      position,
      clientId,
    },
    select: {
      id: true,
      tradeDate: true,
      settlementDate: true,
      stockType: true,
      settlementAmt: true,
      position: true,
      onTime: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const updateTrade = async (
  trade: Omit<Trade, "id">,
  id: string
): Promise<TradeWithClientName> => {
  const {
    tradeDate,
    settlementDate,
    stockType,
    settlementAmt,
    position,
    onTime,
    clientId,
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
      clientId,
    },
    select: {
      id: true,
      tradeDate: true,
      settlementDate: true,
      stockType: true,
      settlementAmt: true,
      position: true,
      onTime: true,
      client: {
        select: {
          name: true,
        },
      },
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
