const { read: fileRead } = require("../../lib/data");
const { parseJSON, tokenVerify } = require("../../helper/utility");
const { deleteToken } = require("../../helper/authToken");

// app scaffolding
const handler = {};

// Only allow the selected request to pass with /user route
handler.signoutHandler = (reqProperty, callback) => {
  if (reqProperty.reqMethod === "get") {
    handler.signout.get(reqProperty, callback);
  } else {
    callback(400, { Error: "This type of request not allowed" });
  }
};

handler.signout = {};

// create new user
handler.signout.get = (reqProperty, callback) => {
  const { token } = reqProperty.reqHeader;

  if (token) {
    fileRead("tokens", token, (err1, data1) => {
      if (!err1 && data1) {
        const tokenObj = parseJSON(data1);
        const { phone } = tokenObj;
        fileRead("users", phone, (err2, data2) => {
          if (!err2 && data2) {
            tokenVerify(phone, token, (isValid) => {
              if (isValid) {
                deleteToken(token, (err3, data3) => {
                  if (!err3 && data3) {
                    callback(200, { Result: "Successfully deleted the token" });
                  } else callback(400, { Error: "Internal server error" });
                });
              } else callback(400, { Error: "Invalid token" });
            });
          } else callback(400, { Error: "User doesn't found" });
        });
      } else {
        callback(500, { Error: "User doesn't exist" });
      }
    });
  } else {
    callback(400, { Error: "Please enter proper body for the request" });
  }
};

module.exports = handler;
