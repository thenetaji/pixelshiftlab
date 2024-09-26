import gm from "gm";
import { normalizeInputPath, normalizeOutputPath } from "../utils/io-path.js";

function formatImage(data, outputFormat) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);
  const outputFilePath = normalizeOutputPath(data.filename, outputFormat);

  return new Promise((resolve, reject) => {
    gm(inputFilePath)
      .write(outputFilePath, (err) => {
        if (err) {
          reject(new Error(`Failed to format image: ${err.message}`));
        } else {
          resolve(outputFilePath);
        }
      });
  });
};

function compressImage(data) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);
  const outputFilePath = normalizeOutputPath(data.filename, data.filetype);

  return new Promise((resolve, reject) => {
    gm(inputFilePath)
      .quality(data.quality)
      .write(outputFilePath, (err) => {
        if (err) {
          reject(new Error(`Failed to compress image: ${err.message}`));
        } else {
          resolve(outputFilePath);
        }
      });
  });
};

function imageMetadata(data) {
  const inputFilePath = normalizeInputPath(data.filename, data.filetype);

  return new Promise((resolve, reject) => {
    gm(inputFilePath)
      .identify((err, meta) => {
        if (err) {
          reject(new Error(`Failed to retrieve image metadata: ${err.message}`));
        } else {
          resolve(meta);
        }
      });
  });
};

export {
  formatImage,
  compressImage,
  imageMetadata
};