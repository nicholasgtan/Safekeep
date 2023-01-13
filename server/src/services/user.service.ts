import prisma from "../utils/prisma.connection";
import { ClientName } from "./client.service";

export interface UserBasicInfo {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserNoPw extends UserBasicInfo {
  id: string;
  client?: ClientName;
}

export interface User extends UserNoPw {
  password: string;
  clientId: string;
}

//* Services
export const listUsers = async (): Promise<UserNoPw[]> => {
  return prisma.user.findMany({
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
