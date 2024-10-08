import cors from "cors";
import dotenv from "dotenv";
import express from "express";
const app = express();
dotenv.config();

import "./utils/delete-cron.js";

//functions
import routes from "./routes/index.js";

const PORT = process.env.PORT || 2626;

//middlewares
app.use(cors({
  origin: "https://pixelshiftlab.web.app/",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log("Server started at", PORT);
});
