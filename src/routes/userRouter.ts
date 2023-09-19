import { Router } from "express";

import {
  loginUser,
  logoutUser,
  authorizeUser,
  registerUser,
  getLoggedInOrders,
} from "../controllers/userController";
import { auth, validate } from "../middleware/middleware";
import { registerSchema } from "../schemas/userSchema";

const userRouter = Router()
  .post("/register", validate(registerSchema), registerUser)
  .post("/login", loginUser)
  .get("/logout", logoutUser)
  .get("/authorize", authorizeUser)
  .get("/me/orders", auth, getLoggedInOrders);

export default userRouter;
