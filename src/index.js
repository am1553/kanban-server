import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

export default app;
