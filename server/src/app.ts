import express, { Application } from "express";
import cors from "cors";
import authRouter from "./routers/auth.router.js";
import { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  const errorMessage = error.message || "Something went wrong";
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    data: [],
    errors: error.errors || [],
  });
});

export default app;
