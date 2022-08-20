const { read: fileRead, create: fileCreate } = require("../../lib/data");
const { hasing } = require("../../helper/utility");
const { createToken } = require("../../helper/authToken");

// app scaffolding
const handler = {};

// Only allow the selected request to pass with /user route
handler.singupHandler = (reqProperty, callback) => {
  if (reqProperty.reqMethod === "post") {
    handler.singup.post(reqProperty, callback);
  } else {
    callback(400, { Error: "This type of request not allowed" });
  }
};

handler.singup = {};

// create new user
handler.singup.post = (reqProperty, callback) => {
  const body = reqProperty.reqBody;
  const fname =
    typeof body.firstName === "string" && body.firstName.trim().length > 0
      ? body.firstName
      : false;
  const lname =
    typeof body.lastName === "string" && body.lastName.trim().length > 0
      ? body.lastName
      : true;
  const phone =
    typeof body.phone === "string" && body.phone.trim().length === 11
      ? body.phone
      : false;
  const address =
    typeof body.address === "string" && body.address.trim().length > 0
      ? body.address
      : false;
  let password =
    typeof body.password === "string" && body.password.length > 2
      ? body.password
      : false;

  if (password) {
    password = hasing(password);
    body.password = password;
  }

  if (fname && lname && phone && password && address) {
    fileRead("users", phone, (err1) => {
      if (err1) {
        fileCreate("users", phone, body, (err2) => {
          if (err2) callback(500, { Error: "Internal Server Error" });
          else {
            createToken(phone, password, (err3, data3) => {
              if (!err3 && data3) {
                callback(200, {
                  firstName: body.firstName,
                  lastName: body.lastName,
                  address: body.address,
                  phone: body.phone,
                  token: data3.id,
                });
              } else {
                callback(500, {
                  Error: "Error From server side already user exist",
                });
              }
            });
          }
        });
      } else {
        callback(500, { Error: "Error From server side already user exist" });
      }
    });
  } else {
    callback(400, { Error: "Please enter proper body for the request" });
  }
};

module.exports = handler;
