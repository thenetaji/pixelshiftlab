const fileInfo = {};
const downloadFileInfo = {};

function addData(data) {
  fileInfo[data.id] = data;
}

function addDownloadData(data) {
  downloadFileInfo[data.id] = data;
}

function findDownloadData(id) {
  return downloadFileInfo[id];
}

function findData(id) {
  return fileInfo[id];
}

function listAllFiles() {
  return Object.keys(fileInfo);
}

export { fileInfo, addData, findData, addDownloadData, findDownloadData };
