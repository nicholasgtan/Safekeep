import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as UserService from "../services/user.service";

//* Routing
export const userRouter = express.Router();

//* GET: List of all Clients
userRouter.get("/", async (request: Request, response: Response) => {
  try {
    const users = await UserService.listUsers();
    return response.status(200).json(users);
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* GET: A single User by Id
userRouter.get("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const user = await UserService.getUser(id);
    if (user) {
      return response.status(200).json(user);
    }
    return response.status(404).json("User not found");
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* POST: Create a User
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
      const newUser = await UserService.createUser(user);
      return response.status(201).json(newUser);
    } catch (error: unknown) {
      return response.status(500).json({ error });
    }
  }
);

//* PUT: Update a User by id
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
      const updatedUser = await UserService.updateUser(user, id);
      return response.status(200).json(updatedUser);
    } catch (error: unknown) {
      return response.status(500).json({ error });
    }
  }
);

//* DELETE: Delete a User by id
userRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    await UserService.deleteUser(id);
    return response
      .status(202)
      .json({ msg: "User has been successfully deleted" });
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});
