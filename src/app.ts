import { errorHandler } from "./middleware/error-handler";
import courseRoute from "./route/course-route";
import auhRoute from "./route/auth-route";
import uploadRoute from "./route/upload-route";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { AuthMiddleware } from "./middleware/authMiddleware";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/course", AuthMiddleware.jwtVerify, courseRoute);
app.use("/auth", auhRoute);
app.use("/upload", uploadRoute);
app.use(errorHandler);

export default app;
