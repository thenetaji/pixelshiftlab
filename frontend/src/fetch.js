function fetchData(URL, data) {
  const BASE_URL = "https://pixelshiftlab.onrender.com/api/v1";
  const request = new FetchRequest(data);
  console.log("data received in fetchData", data);
  console.log("request object made from data in fetchData", request);

  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}${URL}`, request)
      .then((res) => {
        if (data.type != "BLOB") {
          resolve(res.json());
        } else {
          resolve(res);
        }
      })
      .catch((err) => reject(err));
  });
}

function FetchRequest(data) {
  //console.log("data received in fetch function",data);
  const { method, type, payload } = data;
  this.method = method;

  switch (type) {
    case "JSON":
      this.headers = { "Content-Type": "application/json" };
      this.body = JSON.stringify({ payload });
      break;
    case "MULTIPART/FORM-DATA":
      this.body = payload.formData;
      break;
    default:
      break;
  }
}

export default fetchData;
