import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as TradeService from "../services/trade.service";

//* Routing
export const tradeRouter = express.Router();

//* GET: List of all Trades
tradeRouter.get("/", async (request: Request, response: Response) => {
  try {
    const trades = await TradeService.listTrade();
    const bigIntSerialized = () => {
      return JSON.parse(
        JSON.stringify(
          trades,
          (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
        )
      );
    };
    return response.status(200).json(bigIntSerialized());
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* GET: A single Trade by Id
tradeRouter.get("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    const trade = await TradeService.getTrade(id);
    if (trade) {
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            trade,
            (key, value) =>
              typeof value === "bigint" ? value.toString() : value // return everything else unchanged
          )
        );
      };
      return response.status(200).json(bigIntSerialized());
    }
    return response.status(404).json("Trade not found");
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});

//* POST: Create a Trade
tradeRouter.post(
  "/",
  body("custodyAccountId").isString(),
  body("tradeDate").isISO8601(),
  body("settlementDate").isISO8601(),
  body("stockType").isString().isIn(["equity", "fixedIncome"]),
  body("settlementAmt").isInt({ min: 0 }),
  body("position").isString().isIn(["buy", "sell"]),
  body("onTime").isString().isIn(["yes", "no"]).optional({ checkFalsy: true }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const trade = request.body;
      const newTrade = await TradeService.createTrade(trade);
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            newTrade,
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

//* PUT: Update a Trade by id
tradeRouter.put(
  "/:id",
  body("custodyAccountId").isString().optional({ checkFalsy: true }),
  body("tradeDate").isISO8601().optional({ checkFalsy: true }),
  body("settlementDate").isISO8601().optional({ checkFalsy: true }),
  body("stockType")
    .isString()
    .isIn(["equity", "fixedIncome"])
    .optional({ checkFalsy: true }),
  body("settlementAmt").isInt({ min: 0 }).optional({ checkFalsy: true }),
  body("position")
    .isString()
    .isIn(["buy", "sell"])
    .optional({ checkFalsy: true }),
  body("onTime").isString().isIn(["yes", "no"]).optional({ checkFalsy: true }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const id: string = request.params.id;
    try {
      const trade = request.body;
      const updatedTrade = await TradeService.updateTrade(trade, id);
      const bigIntSerialized = () => {
        return JSON.parse(
          JSON.stringify(
            updatedTrade,
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
tradeRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: string = request.params.id;
  try {
    await TradeService.deleteTrade(id);
    return response
      .status(202)
      .json({ msg: "Trade has been succesfully deleted" });
  } catch (error: unknown) {
    return response.status(500).json({ error });
  }
});
