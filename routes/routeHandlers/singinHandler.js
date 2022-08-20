const { read: fileRead } = require("../../lib/data");
const { hasing, parseJSON } = require("../../helper/utility");
const { createToken } = require("../../helper/authToken");

// app scaffolding
const handler = {};

// Only allow the selected request to pass with /user route
handler.singinHandler = (reqProperty, callback) => {
  if (reqProperty.reqMethod === "post") {
    handler.singin.post(reqProperty, callback);
  } else {
    callback(400, { Error: "This type of request not allowed" });
  }
};

handler.singin = {};

// create new user
handler.singin.post = (reqProperty, callback) => {
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
    body.password = password;
  }

  if (phone && password) {
    fileRead("users", phone, (err1, data1) => {
      if (!err1 && data1) {
        const dataObj = parseJSON(data1);
        if (password === dataObj.password) {
          createToken(phone, password, (err2, data2) => {
            if (!err2 && data2) {
              callback(200, {
                firstName: dataObj.firstName,
                lastName: dataObj.lastName,
                address: dataObj.address,
                phone: dataObj.phone,
                token: data2.id,
              });
            } else callback(400, { Error: "Internal Server Error" });
          });
        } else callback(400, { Error: "Invalid Password" });
      } else {
        callback(500, { Error: "User doesn't exist" });
      }
    });
  } else {
    callback(400, { Error: "Please enter proper body for the request" });
  }
};

module.exports = handler;
