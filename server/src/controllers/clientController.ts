import prisma from "../utils/prismaConnection";
import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

type Client = {
  id: string;
  name: string;
  type: string;
  cashBalance: number;
  equityBalance: number;
  fixedIncomeBal: number;
};

// Services
const listClients = async (): Promise<Client[]> => {
  return prisma.client.findMany({
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

const getClient = async (id: string): Promise<Client | null> => {
  return prisma.client.findUnique({
    where: {
      id,
    },
  });
};

const createClient = async (client: Omit<Client, "id">): Promise<Client> => {
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

const updateClient = async (
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

const deleteClient = async (id: string): Promise<void> => {
  await prisma.client.delete({
    where: {
      id,
    },
  });
};

export const clientRouter = express.Router();

// Routing

//GET: List of all Clients
clientRouter.get("/", async (request: Request, response: Response) => {
  try {
    const clients = await listClients();
    return response.status(200).json(clients);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//GET: A single Client by ID
clientRouter.get("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const client = await getClient(id);
    if (client) {
      return response.status(200).json(client);
    }
    return response.status(404).json("Client not found");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//POST: Create a Client
clientRouter.post(
  "/",
  body("name").isString(),
  body("type").isString(),
  body("cashBalance").isNumeric(),
  body("equityBalance").isNumeric(),
  body("fixedIncomeBal").isNumeric(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const client = request.body;
      const newClient = await createClient(client);
      return response.status(201).json(newClient);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

//PUT: Update a Client by id
clientRouter.put(
  "/:id",
  body("name").isString().optional({ checkFalsy: true }),
  body("type").isString().optional({ checkFalsy: true }),
  body("cashBalance").isInt({ min: 0 }).optional({ checkFalsy: true }),
  body("equityBalance").isInt({ min: 0 }).optional({ checkFalsy: true }),
  body("fixedIncomeBal").isInt({ min: 0 }).optional({ checkFalsy: true }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: string = request.params.id;
    try {
      const client = request.body;
      const updatedClient = await updateClient(client, id);
      return response.status(200).json(updatedClient);
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  }
);

//DELETE: Delete a Client by id
clientRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    await deleteClient(id);
    return response.status(204).json("Client has been succesfully deleted");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
