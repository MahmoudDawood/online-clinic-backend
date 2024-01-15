import express, { Express } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandler } from "./utils/errorhandler";
import cors from "cors";
import {
  userRouter,
  locationRouter,
  appointmentRouter,
  reviewRouter,
} from "./routers";
dotenv.config();
const app: Express = express();
const port = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/user", userRouter);
app.use("/location", locationRouter);
app.use("/appointment", appointmentRouter);
app.use("/review", reviewRouter);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
