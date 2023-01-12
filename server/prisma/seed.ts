import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type User = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type Client = {
  name: string;
  type: string;
  cashBalance: number;
  equityBalance: number;
  fixedIncomeBal: number;
};

async function seed() {
  await Promise.all(
    getClients().map((client) => {
      return prisma.client.create({
        data: {
          name: client.name,
          type: client.type,
          cashBalance: client.cashBalance,
          equityBalance: client.equityBalance,
          fixedIncomeBal: client.fixedIncomeBal,
        },
      });
    })
  );
  const client = await prisma.client.findFirst({
    where: { name: "FIL" },
  });

  await Promise.all(
    getUsers().map((user) => {
      const { email, firstName, lastName, password } = user;
      return prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password,
          clientId: client.id,
        },
      });
    })
  );
}
seed();

function getUsers(): Array<User> {
  return [
    {
      email: "alanwalk@fil.com",
      firstName: "Alan",
      lastName: "Walk",
      password: "123",
    },
    {
      email: "benkoh@fil.com",
      firstName: "Ben",
      lastName: "Koh",
      password: "321",
    },
  ];
}

function getClients(): Array<Client> {
  return [
    {
      name: "FIL",
      type: "Investment Manager",
      cashBalance: 100000000,
      equityBalance: 0,
      fixedIncomeBal: 0,
    },
  ];
}
