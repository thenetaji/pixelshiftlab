import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.resolve(__dirname, "../uploads");
const outputPath = path.resolve(__dirname, "../temp");

function normalizeInputPath(path,format){
  return inputPath + "/" + path + "." + format.toLowerCase();
};

function normalizeOutputPath(path,format){
  return outputPath + "/" + path + "." + format.toLowerCase();
};

export {
  normalizeInputPath,
  normalizeOutputPath
}