import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as ClientService from "../services/client.service";

//* Routing
export const clientRouter = express.Router();

//* GET: List of all Clients
clientRouter.get("/", async (request: Request, response: Response) => {
  try {
    const clients = await ClientService.listClients();
    return response.status(200).json(clients);
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//* GET: A single Client by Id
clientRouter.get("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const client = await ClientService.getClient(id);
    if (client) {
      return response.status(200).json(client);
    }
    return response.status(404).json("Client not found");
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

//* POST: Create a Client
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
      const newClient = await ClientService.createClient(client);
      return response.status(201).json(newClient);
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

//* PUT: Update a Client by id
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
      const updatedClient = await ClientService.updateClient(client, id);
      return response.status(200).json(updatedClient);
    } catch (error: any) {
      return response.status(500).json({ error: error.message });
    }
  }
);

//* DELETE: Delete a Client by id
clientRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    await ClientService.deleteClient(id);
    return response
      .status(202)
      .json({ msg: "Client has been succesfully deleted" });
  } catch (error: any) {
    return response.status(500).json({ msg: "Client does not exist" });
  }
});
