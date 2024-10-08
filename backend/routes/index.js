import express from "express";
const router = express.Router();

import uploadRoute from "./upload.js";
import downloadRoute from "./download.js";
import imageRoute from "./image-route.js";

router.use("/upload", uploadRoute);
router.use("/download", downloadRoute);
router.use("/image", imageRoute);

router.use("/status", (req, res) => {
  res.end("Running and up");
});
router.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "You are Lost",
  });
});

export default router;
