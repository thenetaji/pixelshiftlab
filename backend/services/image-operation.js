import gm from "gm";
import { normalizeInputPath, normalizeOutputPath } from "../utils/io-path.js";

function formatImage(data, outputFormat) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);
  const outputFilePath = normalizeOutputPath(data.filename, outputFormat);

  return new Promise((resolve, reject) => {
    gm(inputFilePath)
      .setFormat(outputFormat)
      .write(outputFilePath, (err) => {
        if (err) {
          return reject(new Error(`Failed to format image: ${err.message}`));
        }
        resolve(outputFilePath);
      });
  });
}

function compressImage(data) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);
  const outputFilePath = normalizeOutputPath(data.filename, data.filetype);

  return new Promise((resolve, reject) => {
    gm(inputFilePath)
      .quality(data.compress) // Setting compression quality
      .write(outputFilePath, (err) => {
        if (err) {
          return reject(new Error(`Failed to compress image: ${err.message}`));
        }
        resolve(outputFilePath);
      });
  });
}

function imageMetadata(data) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);

  return new Promise((resolve, reject) => {
    gm(inputFilePath).identify((err, metadata) => {
      if (err) {
        return reject(new Error(`Failed to retrieve image metadata: ${err.message}`));
      }
      resolve(metadata);
    });
  });
}

export { formatImage, compressImage, imageMetadata };