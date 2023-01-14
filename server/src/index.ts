import * as dotenv from "dotenv";
import express from "express";
import session from "express-session";

import { clientRouter } from "./controllers/client.controller";
import { userRouter } from "./controllers/user.controller";
import { sessionRouter } from "./controllers/session.controller";
import { tradeRouter } from "./controllers/trade.controller";

dotenv.config();
if (!process.env.PORT) {
  process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);
const SECRET: string = process.env.SECRET as string;

const sess = {
  secret: SECRET,
  resave: false,
  saveUninitialized: false, //set to false to prevent cookie from being generated until login
  cookie: {
    secure: false,
  },
};

const app = express();
//* Middleware
app.use(express.json());

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));

app.use("/api/clients", clientRouter);
app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);
app.use("/api/trades", tradeRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
