const crypto = require("crypto");
const enviroment = require("./enviroment");
const { read: fileRead } = require("../lib/data");

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

app.createToken = (length) => {
  let token = "";
  const allChar = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i += 1) {
    const randNumber = Math.floor(Math.random() * 35);
    token += allChar.at(randNumber);
  }
  return token;
};

app.tokenVerify = (phone, token, callback) => {
  fileRead("tokens", token, (err1, data1) => {
    if (!err1 && data1) {
      const dataObj = app.parseJSON(data1);
      if (
        dataObj.id === token &&
        dataObj.phone === phone &&
        dataObj.expire > Date.now()
      )
        callback(true);
      else callback(false);
    } else callback(false);
  });
};

module.exports = app;
