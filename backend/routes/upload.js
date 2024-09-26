import path from "path";
import multer from "multer";
import express from "express";
const router = express.Router();

import { addData } from "../utils/db.js";

const storage = multer.diskStorage({
  destination: function(req,file,cb)
  {
    cb(null, "./uploads/");
    /*cb stands for callback*/
  },
  filename: function(req,file,cb) {
  /*const fileName = `"WizardImage"-${file.mimetype.split("/")[0]}-${Date.now()}`; name for watermark with original name */
    const fileName = `PixelShiftLab-${Date.now()}.${file.mimetype.split("/")[1]}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

router
.post("/",
upload.single("input_file"),
handleFileUpload);

function handleFileUpload(req,res){
  if(!req.file){
    return res.status(400).json({
      status: 400,
      message: "No files provided"
    });
  };
  
  const fileInfo = {
    id: (Math.random().toString(36).slice(2) + Date.now().toString(36)),
    filename: (req.file.filename)
    .split(".")[0],
    filetype: (req.file.mimetype).split("/")[1],
    size: req.file.size
  };
  addData(fileInfo);
  
  res.status(202).json({
    status: 202,
    id: fileInfo.id,
    message: "Request for any operation with this id:" + fileInfo.id
  });
};

export default router;