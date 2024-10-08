import path from "path";
import multer from "multer";
import express from "express";
import fs from "fs";
const router = express.Router();

import { addData } from "../utils/db.js";

const uploadDir = "./uploads";
const tempDir = "./temp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // Use the created uploads directory
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