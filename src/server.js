import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createUser, deleteUser, signin } from "./handlers/users.js";
import { protect } from "./modules/auth.js";
import router from "./router/index.js";
import pool from "./db/index.js";
const app = express();
const corsOptions = {
  origin: ["http://localhost:5173", "https://kanban-react-app.onrender.com"],
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
// middleware

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

const checkDatabaseConnection = async (req, res, next) => {
  try {
    await pool.query("SELECT 1");
    console.log("CONNECTED TO DATABASE...");
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database connection failed" });
  }
};

app.post("/users", createUser);
app.post("/signin", signin);
app.delete("/users/:id", deleteUser);
app.use("/api/v1", protect, router);

app.use(checkDatabaseConnection);

export default app;
