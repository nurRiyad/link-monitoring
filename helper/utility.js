const crypto = require("crypto");
const enviroment = require("./enviroment");

const app = {};

app.parseJSON = (json) => {
  let jsonObj = {};
  try {
    jsonObj = JSON.parse(json);
    return jsonObj;
  } catch (error) {
    console.log("Cant parse the reqbody");
  }
  return jsonObj;
};

app.hasing = (password) => {
  if (typeof password === "string" && password.length > 0) {
    const hash = crypto
      .createHmac("sha256", enviroment.key)
      .update(password)
      .digest("hex");
    return hash;
  }
  return false;
};

module.exports = app;
