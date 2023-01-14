import { Prisma, User } from "@prisma/client";
import prisma from "../utils/prisma.connection";

const userWithClientName = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    password: true,
    client: {
      select: {
        name: true,
      },
    },
  },
});

type UserWithClientName = Prisma.UserGetPayload<typeof userWithClientName>;

const userNoPw = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    client: {
      select: {
        name: true,
      },
    },
  },
});

type UserNoPw = Prisma.UserGetPayload<typeof userNoPw>;

//* Services
export const listUsers = async (): Promise<UserWithClientName[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getUser = async (id: string): Promise<UserNoPw | null> => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getUserSession = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      client: {
        select: {
          name: true,
        },
      },
      clientId: true,
    },
  });
};

export const createUser = async (user: Omit<User, "id">): Promise<User> => {
  const { email, firstName, lastName, password, clientId } = user;
  return prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password,
      clientId,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      clientId: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const updateUser = async (
  user: Omit<User, "id">,
  id: string
): Promise<User> => {
  const { email, firstName, lastName, password, clientId } = user;
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      email,
      firstName,
      lastName,
      password,
      clientId,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      clientId: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({
    where: {
      id,
    },
  });
};
