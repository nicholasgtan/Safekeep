import * as dotenv from "dotenv";
import express from "express";

import { clientRouter } from "./controllers/clientController";
import { userRouter } from "./controllers/userController";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use("/api/clients", clientRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
