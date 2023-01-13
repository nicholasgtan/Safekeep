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

export interface UserNoPw extends UserBasicInfo {
  id: string;
  client?: ClientName;
}

export interface User extends UserNoPw {
  password: string;
  clientId: string;
}

// Services
const listUsers = async (): Promise<UserNoPw[]> => {
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

const getUser = async (id: string): Promise<UserNoPw | null> => {
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

const createUser = async (user: Omit<User, "id">): Promise<User> => {
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

const updateUser = async (
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

const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({
    where: {
      id,
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

//POST: Create a User
userRouter.post(
  "/",
  body("email").isString(),
  body("firstName").isString(),
  body("lastName").isString(),
  body("password").isString(),
  body("clientId").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const user = request.body;
      const newUser = await createUser(user);
      return response.status(201).json(newUser);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

//PUT: Update a User by id
userRouter.put(
  "/:id",
  body("email").isString().optional({ checkFalsy: true }),
  body("firstName").isString().optional({ checkFalsy: true }),
  body("lastName").isString().optional({ checkFalsy: true }),
  body("password").isString().optional({ checkFalsy: true }),
  body("clientId").isString().optional({ checkFalsy: true }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: string = request.params.id;
    try {
      const user = request.body;
      const updatedUser = await updateUser(user, id);
      return response.status(200).json(updatedUser);
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  }
);

//DELETE: Delete a User by id
userRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    await deleteUser(id);
    return response
      .status(202)
      .json({ msg: "User has been successfully deleted" });
  } catch (error: any) {
    return response.status(500).json({ msg: "User does not exist" });
  }
});
