import { findData, addDownloadData } from "../utils/db.js";
import {
  formatImage,
  compressImage,
  imageMetadata,
} from "../services/image-operation.js";

async function handleFormatConversion(req, res) {
  // console.log("req received in handleFormatConversion",req,req.body);
  if (Object.keys(req.body).length == 0) {
    return res.status(400).json({
      status: 400,
      message: "Body is empty!",
    });
  }
  const {
    payload: { id, format },
  } = req.body;
  if (!id || !format) {
    return res.status(400).json({
      status: 400,
      message: "Id and format are not provided.Maybe they fell in the way",
    });
  }
  const data = findData(id);
  if (!data || !data.id) {
    return res.status(404).json({
      status: 404,
      message: "Database is empty or the request is too early",
    });
  }

  try {
    const formatted = await formatImage(data, format);
    addDownloadData({
      id: id,
      filename: data.filename,
      filetype: format.toLowerCase(),
    });

    res.status(200).json({
      status: 200,
      message: "Image formatted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error formatting image",
      error: err.message,
    });
  }
}

async function handleImageCompression(req, res) {
  // console.log("req received in handleFormatConversion", req);
  const {
    payload: { id, compress },
  } = req.body;
  if (!id || !compress) {
    return res.status(400).json({
      status: 400,
      message:
        "Id and compression rate are not provided.Maybe they fell in the way",
    });
  }
  const data = findData(id);
  // console.log("data in compress", data);
  if (!data || !data.id) {
    return res.status(404).json({
      status: 404,
      message: "Database is empty or the request is too early",
    });
  }

  try {
    const compressed = await compressImage(data, compress);
    addDownloadData({
      id: id,
      filename: data.filename,
      filetype: data.filetype,
    });

    res.status(200).json({
      status: 200,
      message: "Image compressed successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error compressing image",
      error: err.message,
    });
  }
}

async function handleImageIdentification(req, res) {
  const {
    payload: { id },
  } = req.body;
  if (!id) {
    return res.status(400).json({
      status: 400,
      message: "Id is not provided.Maybe they fell in the way",
    });
  }
  const data = findData(id);
  if (!data || !data.id) {
    return res.status(404).json({
      status: 404,
      message: "Database is empty or the request is too early",
    });
  }

  try {
    const metadata = await imageMetadata(data);

    res.status(200).json({
      status: 200,
      message: "Image metadata retrieved successfully",
      data: {
        metadata: metadata,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Error retrieving image metadata",
      error: err.message,
    });
  }
}

export {
  handleFormatConversion,
  handleImageCompression,
  handleImageIdentification,
};
