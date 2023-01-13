import prisma from "../utils/prismaConnection";
import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ClientName } from "./clientController";

export interface UserBasicInfo {
  email: string;
  firstName: string;
  lastName: string;
}

export interface User extends UserBasicInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  clientId?: string;
  client?: ClientName;
}

// Services
const listUsers = async (): Promise<User[]> => {
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

const getUser = async (id: string): Promise<User | null> => {
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

// Routing
export const userRouter = express.Router();

//GET: List of all Clients
userRouter.get("/", async (request: Request, response: Response) => {
  try {
    const users = await listUsers();
    return response.status(200).json(users);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//GET: A single User by Id
userRouter.get("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const user = await getUser(id);
    if (user) {
      return response.status(200).json(user);
    }
    return response.status(404).json("User not found");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
