import express from "express";
const router = express.Router();
import path from "path";
import { fileURLToPath } from "url";
import { findDownloadData } from "../utils/db.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesDirectory = path.join(__dirname, "../temp");

router.get("/", downloadFile);

async function downloadFile(req, res) {
  // console.log("req in download route", req.query);
  const { id } = req.query;
  const data = await findDownloadData(id);
  // console.log("data", data);
  if (!data) {
    // console.log("Database is empty");
    return res.status(404).json({
      status: 404,
      message: "Database is empty or the request is too early",
    });
  }

  const filePath = path.resolve(
    filesDirectory,
    data.filename + "." + data.filetype,
  );
  if (!fs.existsSync(filePath)) {
    // console.log("File not found");
    return res.status(404).json({
      status: 404,
      message: "Your file has been lost. Maybe it went for a walk.Who knows??",
    });
  }

  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${data.filename}.${data.filetype}"`,
  );
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

  res.download(filePath, (err) => {
    if (err) {
      // console.error("Error downloading file:", err);
      res.status(500).json({
        status: 500,
        message: "Error while downloading the file",
      });
    }
  });
}

export default router;
