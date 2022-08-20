const {
  read: fileRead,
  create: fileCreate,
  update: fileUpdate,
  delete: fileDelete,
} = require("../lib/data");
const { hasing, parseJSON, createToken } = require("./utility");

// app scaffolding
const auth = {};

// create new token
auth.createToken = (Phone, Password, callback) => {
  const phone =
    typeof Phone === "string" && Phone.trim().length === 11 ? Phone : false;
  let password =
    typeof Password === "string" && Password.length > 2 ? Password : false;

  if (password) {
    password = hasing(password);
  }

  if (phone && password) {
    const tokenId = createToken(20);
    const tokenData = {
      id: tokenId,
      expire: Date.now() + 24 * 60 * 60 * 1000,
      phone,
      password,
    };
    fileCreate("tokens", tokenId, tokenData, (err2) => {
      if (err2) callback({ Error: "Cant create Token" }, "");
      else callback("", tokenData);
    });
  } else callback({ Error: "Cant create Token" }, "");
};

// get token data
auth.getToken = (reqProperty, callback) => {
  let { id: token } = reqProperty.reqQuery;
  token = typeof token === "string" && token.length === 20 ? token : false;
  if (token) {
    fileRead("tokens", token, (err1, data1) => {
      if (!err1 && data1) {
        const dataObj = parseJSON(data1);
        callback(200, dataObj);
      } else callback(404, { Error: "Internal server error" });
    });
  } else {
    callback(400, { Error: "Internal server errors" });
  }
};

// update token data
auth.updateToken = (reqProperty, callback) => {
  const { id, extend } = reqProperty.reqBody;
  const tokenId = typeof id === "string" && id.length === 20 ? id : false;
  const extendToken = typeof extend === "boolean" ? extend : false;

  if (tokenId && extendToken) {
    fileRead("tokens", tokenId, (err1, data1) => {
      if (!err1 && data1) {
        const dataObj = parseJSON(data1);
        dataObj.expire = Date.now() + 60 * 60 * 1000;

        fileUpdate("tokens", tokenId, dataObj, (err2, data2) => {
          if (!err2 && data2) {
            callback(200, { Result: "Successfully updated the data" });
          } else {
            callback(404, { Error: "Internal server error" });
          }
        });
      } else {
        callback(400, { Error: "Internal server error" });
      }
    });
  } else {
    callback(400, { Error: "Internal server Error" });
  }
};

// delete existing token
auth.deleteToken = (reqProperty, callback) => {
  let { id: token } = reqProperty.reqQuery;
  token = typeof token === "string" && token.length === 20 ? token : false;
  if (token) {
    fileRead("tokens", token, (err1, data1) => {
      if (!err1 && data1) {
        fileDelete("tokens", token, (err2) => {
          if (err2) callback(400, { Error: "Internal server error" });
          else callback(200, { result: "seccessfully delete the token" });
        });
      } else callback(400, { Error: "Internal server error" });
    });
  } else {
    callback(400, { Error: "Internal error on server" });
  }
};

module.exports = auth;
