import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";

dotenv.config();

import "./utils/delete-cron.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 2626;

// Middlewares
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Routes
app.use("/api/v1", routes);

// Starting the server
app.listen(PORT, () => {
  const uploadDir = "./uploads";
  const tempDir = "./temp";
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  console.log("Current Directory:", process.cwd());
  console.log("Files:", fs.readdirSync(process.cwd()));
  console.log("Server started at", PORT);
});