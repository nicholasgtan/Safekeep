import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as UserService from "../services/user.service";
import bcrypt from "bcrypt";

//* Routing
export const userRouter = express.Router();

//* GET: List of all Clients
userRouter.get("/", async (request: Request, response: Response) => {
  try {
    const users = await UserService.adminListUsers();
    return response.status(200).json(users);
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* GET: A single User by Id
userRouter.get("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const user = await UserService.ClientGetUserById(id);
    if (user) {
      return response.status(200).json(user);
    }
    return response.status(404).json({ msg: "User not found" });
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* GET: Client get Account details by User Id
userRouter.get("/account/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const account = await UserService.ClientGetAccountBalanceById(id);
    if (account) {
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            account,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          )
        );
      };
      return response.status(200).json(bigIntSerialized());
    }
    return response.status(404).json({ msg: "Account not found" });
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
  body("userClientId").isString().optional({ checkFalsy: true }),
  body("role")
    .isString()
    .isIn(["client", "admin"])
    .optional({ checkFalsy: true }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const saltRounds = 10;
      const { email, firstName, lastName, password, role, userClientId } =
        request.body;
      const hashed = bcrypt.hashSync(password, saltRounds);
      const newUser = await UserService.adminCreateUser({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashed,
        role,
        userClientId: userClientId,
      });
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
  body("userClientId").isString().optional({ checkFalsy: true }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: string = request.params.id;
    try {
      const user = request.body;
      const updatedUser = await UserService.adminUpdateUser(user, id);
      return response.status(200).json(updatedUser);
    } catch (error: unknown) {
      return response.status(500).json({ error });
    }
  }
);

//* PUT: Assign Client to Admin by Id
userRouter.put(
  "/admin/:id",
  body("id").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: string = request.params.id;
    try {
      const user = request.body;
      const updatedUser = await UserService.adminAddClient(user, id);
      if (updatedUser.role === "admin") {
        return response.status(200).json(updatedUser);
      } else {
        return response.status(401).json({ msg: "Unauthorized" });
      }
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
