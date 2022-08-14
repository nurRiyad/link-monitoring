const {
  read: fileRead,
  create: fileCreate,
  update: fileUpdate,
  delete: fileDelete,
} = require("../../lib/data");
const { hasing, parseJSON, createToken } = require("../../helper/utility");

// app scaffolding
const handler = {};

// Only allow the selected request to pass with /user route
handler.tokenHandler = (reqProperty, callback) => {
  const valideReqType = ["get", "put", "post", "delete"];
  if (valideReqType.includes(reqProperty.reqMethod)) {
    handler.token[reqProperty.reqMethod](reqProperty, callback);
  } else {
    callback(400, { Error: "This type of request not allowed" });
  }
};

handler.token = {};

// get token data
handler.token.get = (reqProperty, callback) => {
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

// create new token
handler.token.post = (reqProperty, callback) => {
  const body = reqProperty.reqBody;
  const phone =
    typeof body.phone === "string" && body.phone.trim().length === 11
      ? body.phone
      : false;
  let password =
    typeof body.password === "string" && body.password.length > 2
      ? body.password
      : false;

  if (password) {
    password = hasing(password);
  }

  if (phone && password) {
    fileRead("users", phone, (err1, data1) => {
      if (!err1 && data1) {
        const dataObj = parseJSON(data1);
        const userPassword = dataObj.password;
        if (userPassword === password) {
          const tokenId = createToken(20);
          const tokenData = {
            id: tokenId,
            expire: Date.now() + 60 * 60 * 1000,
            phone,
          };
          fileCreate("tokens", tokenId, tokenData, (err2) => {
            if (err2) callback(400, { Error: "Internal Server Error" });
            else callback(200, { Result: "Successfully token created" });
          });
        } else callback(400, { Error: "Sorry Auth Invalid" });
      } else {
        callback(500, { Error: "Error From server side already user exist" });
      }
    });
  } else {
    callback(400, { Error: "Please enter proper body for the request" });
  }
};

// update token data
handler.token.put = (reqProperty, callback) => {
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
handler.token.delete = (reqProperty, callback) => {
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

module.exports = handler;
