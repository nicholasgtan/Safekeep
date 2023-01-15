import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as ClientService from "../services/client.service";

//* Routing
export const clientRouter = express.Router();

//* GET: List of all Clients
clientRouter.get("/", async (request: Request, response: Response) => {
  try {
    const clients = await ClientService.listClients();
    const bigIntSerialized = () => {
      return JSON.parse(
        JSON.stringify(
          clients,
          (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
        )
      );
    };
    return response.status(200).json(bigIntSerialized());
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* GET: A single Client by Id
clientRouter.get("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const client = await ClientService.getClientById(id);
    if (client) {
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            client,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          )
        );
      };
      return response.status(200).json(bigIntSerialized());
    }
    return response.status(404).json("Client not found");
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* POST: Create a Client without account
clientRouter.post(
  "/",
  body("name").isString(),
  body("type").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const client = request.body;
      const newClient = await ClientService.createClient(client);
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            newClient,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          )
        );
      };
      return response.status(201).json(bigIntSerialized());
    } catch (error: unknown) {
      return response.status(500).json({ error });
    }
  }
);

//* POST: Create a Client and autocreate Account
clientRouter.post(
  "/auto",
  body("name").isString(),
  body("type").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const client = request.body;
      const newClientWithAcc = await ClientService.createClientWithAcc(client);
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            newClientWithAcc,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          )
        );
      };
      return response.status(201).json(bigIntSerialized());
    } catch (error: unknown) {
      return response.status(500).json({ error });
    }
  }
);

//* PUT: Update a Client by id
clientRouter.put(
  "/:id",
  body("name").isString().optional({ checkFalsy: true }),
  body("type").isString().optional({ checkFalsy: true }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: string = request.params.id;
    try {
      const client = request.body;
      const updatedClient = await ClientService.updateClientById(client, id);
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            updatedClient,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          )
        );
      };
      return response.status(200).json(bigIntSerialized());
    } catch (error: unknown) {
      return response.status(500).json({ error });
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
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});
