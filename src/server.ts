import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRouter from "./routes/userRouter";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is up and listening on port: ${port}`);
});
