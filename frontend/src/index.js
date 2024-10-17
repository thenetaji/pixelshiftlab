import fetchData from "./fetch.js";

const formData = new FormData();
let id;

window.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  fetch("http://localhost:2626/api/v1/status").then((res) => console.info(res));
});
const functionalityChangeDropdown = document.querySelector(
  ".functionality-change-dropdown",
);
const functionalityChangeOptions = document.querySelector(
  ".functionality-change-options",
);

window.addEventListener("DOMContentLoaded", changeOptionValues);
functionalityChangeDropdown.addEventListener("change", changeOptionValues);

function changeOptionValues() {
  const optionValues = {
    format: [
      { value: "PNG" },
      { value: "JPG" },
      { value: "JPEG" },
      { value: "WEBP" },
    ],
  };

  functionalityChangeOptions.innerHTML = "";

  if (functionalityChangeDropdown.value.toLowerCase() === "convert format") {
    optionValues.format.forEach((i) => {
      const option = document.createElement("option");
      option.value = i.value;
      option.textContent = i.value;
      functionalityChangeOptions.appendChild(option);
    });
  } else if (functionalityChangeDropdown.value.toLowerCase() === "compress") {
    for (let i = 0; i <= 100; i++) {
      if (i == 0 || i == 100) continue;
      if (i % 10 === 0) {
        const option = document.createElement("option");
        option.textContent = "Compress " + i + "%";
        option.value = 100 - i + "%";
        functionalityChangeOptions.appendChild(option);
      }
    }
  }
}

document
  .querySelector(".submit-btn")
  .addEventListener("click", handleImageOperation);

document.getElementById("input_file").addEventListener("change", (event) => {
  if (event.target.files && event.target.files.length >= 1) {
    formData.delete("input_file");
  }
  if (event.target.files && event.target.files.length > 0) {
    formData.append("input_file", event.target.files[0]);
  }
});

async function handleUpload() {
  try {
    const uploadRes = await fetchData("/upload", {
      method: "POST",
      type: "MULTIPART/FORM-DATA",
      payload: {
        formData,
      },
    });
    console.log("response received from upload function", uploadRes);
    return uploadRes.data.id;
  } catch (error) {
    console.error("Error in handleUpload:", error);
  }
}

const fileInfoSection = document.querySelector(".uploaded-file-status");
const fileSize = document.querySelector(".file-size");
const fileName = document.querySelector(".file-name");

async function handleImageOperation(error) {
  try {
    error.preventDefault();
    showFileInfo();

    const operationName = functionalityChangeDropdown.value;
    const operationValue = functionalityChangeOptions.value.split("%")[0];

    id = await handleUpload();
    console.log("id to be received from handleUpload function", id);

    let payload = { id };

    if (operationName.toLowerCase() == "compress") {
      payload.compress = operationValue;
    } else {
      payload.format = operationValue;
    }

    fetchData(
      `/image/${operationName.toLowerCase() == "compress" ? "compress" : "format"}`,
      {
        method: "POST",
        type: "JSON",
        payload,
      },
    ).then((res) => {
      const downloadBtn = document.querySelector(".download-btn");
      downloadBtn.classList.remove("hidden");
      downloadBtn.addEventListener("click", downloadFile);
    });
  } catch (err) {
    console.log(err);
  }
}

function showFileInfo() {
  fileInfoSection.classList.remove("hidden");

  const fileObj = formData.get("input_file");

  if (fileObj) {
    console.log("File name:", fileObj.name);
    console.log("File size (in bytes):", fileObj.size);
    console.log("File type:", fileObj.type);

    document.querySelector(".uploaded-file-status-container").innerHTML = `
      <p>File Name: ${fileObj.name}</p>
      <p>File Size: ${(fileObj.size / 1024).toFixed(2)} KB</p>
      <p>File Type: ${fileObj.type}</p>
    `;
  } else {
    console.error("No file found in FormData");
  }
}

async function downloadFile() {
  try {
    const response = await fetchData("/download?id=" + id, {
      method: "GET",
      type: "BLOB",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok", response);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const disposition = response.headers.get("Content-Disposition");
    let filename = "downloaded_file";
    if (disposition && disposition.indexOf("attachment") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.log(err);
  }
}
