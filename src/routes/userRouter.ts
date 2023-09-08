import { Router } from "express";

import {
  loginUser,
  logoutUser,
  authorizeUser,
  registerUser,
} from "../controllers/userController";

const userRouter = Router()
  .post("/register", registerUser)
  .post("/login", loginUser)
  .get("/logout", logoutUser)
  .get("/authorize", authorizeUser);

export default userRouter;
