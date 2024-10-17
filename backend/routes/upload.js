import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import express from "express";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { addData } from "../utils/db.js";
const uploadsDir = path.resolve(__dirname,"../uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
    /*cb stands for callback*/
  },
  filename: function (req, file, cb) {
    const fileName = `PixelShiftLab-${Date.now()}.${file.mimetype.split("/")[1]}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("input_file"), handleFileUpload);

function handleFileUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({
      status: 400,
      message: "No files provided",
    });
  }

  const fileInfo = {
    id: Math.random().toString(36).slice(2) + Date.now().toString(36),
    filename: req.file.filename.split(".")[0],
    filetype: req.file.mimetype.split("/")[1],
    size: req.file.size,
  };
  addData(fileInfo);

  res.status(202).json({
    status: 202,
    message: "Request for any operation with the id provided",
    data: {
      id: fileInfo.id,
    },
  });
}

export default router;
