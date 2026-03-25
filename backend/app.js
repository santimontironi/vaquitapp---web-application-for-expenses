import express from "express";
import dotenv from "dotenv";
import {router as authRouter} from "./routes/auth.routes.js";
import {router as groupRouter} from "./routes/group.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("", authRouter);
app.use("", groupRouter);

export default app;