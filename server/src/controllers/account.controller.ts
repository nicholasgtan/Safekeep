import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as AccountService from "../services/account.services";

//* Routing
export const accountRouter = express.Router();

//* GET: List of all Accounts
accountRouter.get("/", async (request: Request, response: Response) => {
  try {
    const account = await AccountService.listAccount();
    const bigIntSerialized = () => {
      return JSON.parse(
        JSON.stringify(
          account,
          (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
        )
      );
    };
    return response.status(200).json(bigIntSerialized());
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* GET: A single Account by Id
accountRouter.get("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const account = await AccountService.getAccountById(id);
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
    return response.status(404).json("Account not found");
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* POST: Create an Account
accountRouter.post(
  "/",
  body("cashBalance").isInt({ min: 0 }),
  body("equityBalance").isInt({ min: 0 }),
  body("fixedIncomeBal").isInt({ min: 0 }),
  body("clientId").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const account = request.body;
      const newAccount = await AccountService.createAccount(account);
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            newAccount,
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

//* PUT: Update an Account by id
accountRouter.put(
  "/:id",
  body("cashBalance").isInt({ min: 0 }).optional({ checkFalsy: true }),
  body("equityBalance").isInt({ min: 0 }).optional({ checkFalsy: true }),
  body("fixedIncomeBal").isInt({ min: 0 }).optional({ checkFalsy: true }),
  // body("clientId").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: string = request.params.id;
    try {
      const account = request.body;
      const updatedAccount = await AccountService.updateAccount(account, id);
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            updatedAccount,
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

//* DELETE: Delete a Trade by id
accountRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    await AccountService.deleteAccount(id);
    return response
      .status(202)
      .json({ msg: "Account has been succesfully deleted" });
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});
