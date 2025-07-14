import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

const corsOptions = {
  origin: "https://backend-hub.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.static("public"));

app.use(cookieParser());

import AuthRouter from "./Src/Routes/Auth.routes.js";

app.use("/api/v1/auth", AuthRouter);

import ProjectRouter from "./Src/Routes/project.route.js";

app.use("/api/v1/organization/project", ProjectRouter);

import TaskRouter from "../Backend/Src/Routes/task.route.js";

app.use("/api/v1/project/task", TaskRouter);


export { app };
