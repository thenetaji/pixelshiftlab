import express from "express";
const router = express.Router();

import {
  handleFormatConversion,
  handleImageCompression,
  handleImageIdentification,
} from "../controllers/image.js";

router.post("/format", handleFormatConversion);

router.post("/compress", handleImageCompression);

router.post("/metadata", handleImageIdentification);

export default router;
