import sharp from "sharp";
import { normalizeInputPath, normalizeOutputPath } from "../utils/io-path.js";

function formatImage(data, outputFormat) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);
  const outputFilePath = normalizeOutputPath(data.filename, outputFormat);

  return sharp(inputFilePath)
    .toFormat(outputFormat)
    .toFile(outputFilePath)
    .then(() => outputFilePath)
    .catch((err) => {
      throw new Error(`Failed to format image: ${err.message}`);
    });
}

function compressImage(data) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);
  const outputFilePath = normalizeOutputPath(data.filename, data.filetype);

  return sharp(inputFilePath)
    .jpeg({ quality: data.compress })
    .toFile(outputFilePath)
    .then(() => outputFilePath)
    .catch((err) => {
      throw new Error(`Failed to compress image: ${err.message}`);
    });
}

function imageMetadata(data) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);

  return sharp(inputFilePath)
    .metadata()
    .then((meta) => meta)
    .catch((err) => {
      throw new Error(`Failed to retrieve image metadata: ${err.message}`);
    });
}

export { formatImage, compressImage, imageMetadata };