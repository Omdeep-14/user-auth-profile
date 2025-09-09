import express from "express";
import { signUp, login } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.get("/users", (res, req) => {});

authRouter.post("/signup", signUp);

authRouter.post("/login", login);

authRouter.post("/logout", (res, req) => {});

export default authRouter;
