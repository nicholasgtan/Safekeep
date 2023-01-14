import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { getUserSession } from "../services/user.service";
import bcrypt from "bcrypt";

export const sessionRouter = express.Router();

//* Include interface to declare additional properties to session opject using declaration merging.
declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
    currentUser: string;
    role: string;
    msg: string;
  }
}

//* Session Login
sessionRouter.post(
  "/",
  body("email").isString(),
  body("password").isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = request.body;
      const foundUser = await getUserSession(email);
      if (!foundUser) {
        return response
          .status(401)
          .json({ msg: "Email not valid, please sign up." });
      }
      const passwordNotMatched = !bcrypt.compareSync(
        password,
        foundUser.password
      );
      if (passwordNotMatched) {
        return response
          .status(401)
          .json({ msg: "Password not valid, please try again." });
      }
      request.session.authenticated = true;
      request.session.currentUser = foundUser.id;
      request.session.role = foundUser.role;
      request.session.msg = "Logged in";
      response.status(202).json(request.session);
    } catch (error: unknown) {
      return response.status(500).json({ error });
    }
  }
);

//* Session Logout
sessionRouter.delete("/", (request: Request, response: Response) => {
  request.session.destroy(() => {
    response.json({ msg: "Logout success" });
  });
});
