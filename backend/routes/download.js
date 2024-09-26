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

async function downloadFile(req,res){
  const { id } = req.query;
  const data = await findDownloadData(id);
  if(!data) {
    return res.status(404).json({
      status: 404,
      message: "Database is empty or the request is too early",
    });
  };
  
  const filePath = path.resolve(filesDirectory,data.filename + "." + data.type);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: 404,
      message: "Your file has been lost. Maybe it went for a walk.Who knows??"
    });
   };

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ 
        status: 500, 
        message: "Error while downloading the file" 
      });
    };
  });
};

export default router;