import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";

import userRouter from "./routes/userRouter";
import productRouter from "./routes/productRouter";
import checkoutRouter from "./routes/checkoutRouter";
import orderRouter from "./routes/orderRouter";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: "session",
    secret: process.env.COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "strict",
    httpOnly: true,
  })
);

app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", orderRouter);

app.listen(port, () => {
  console.log(`Server is up and listening on port: ${port}`);
});
