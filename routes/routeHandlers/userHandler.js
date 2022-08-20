const {
  read: fileRead,
  update: fileUpdate,
  delete: fileDelete,
} = require("../../lib/data");
const { hasing, parseJSON, tokenVerify } = require("../../helper/utility");

// app scaffolding
const handler = {};

// Only allow the selected request to pass with /user route
handler.userHandler = (reqProperty, callback) => {
  const valideReqType = ["get", "put", "post", "delete"];
  if (valideReqType.includes(reqProperty.reqMethod)) {
    handler.user[reqProperty.reqMethod](reqProperty, callback);
  } else {
    callback(400, { Error: "This type of request not allowed" });
  }
};

handler.user = {};

// get user data
handler.user.get = (reqProperty, callback) => {
  let { phone } = reqProperty.reqQuery;
  let { token } = reqProperty.reqHeader;
  phone = typeof phone === "string" && phone.length === 11 ? phone : false;
  token = typeof token === "string" && token.length === 20 ? token : false;

  if (phone && token) {
    tokenVerify(phone, token, (isValidToken) => {
      if (isValidToken) {
        fileRead("users", phone, (err1, data1) => {
          if (!err1 && data1) {
            const dataObj = parseJSON(data1);
            if (dataObj.password) delete dataObj.password;
            callback(200, dataObj);
          } else callback(404, { Error: "Internal server error" });
        });
      } else {
        callback(400, { Error: "Invalide auth token" });
      }
    });
  } else {
    callback(400, { Error: "Internal server errors" });
  }
};

// update user data
handler.user.put = (reqProperty, callback) => {
  const body = reqProperty.reqBody;

  let { token } = reqProperty.reqHeader;
  token = typeof token === "string" && token.length === 20 ? token : false;

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

  if ((fname || lname || address || password) && token && phone) {
    tokenVerify(phone, token, (isValidToken) => {
      if (isValidToken) {
        fileRead("users", phone, (err1, data1) => {
          if (!err1 && data1) {
            const dataObj = parseJSON(data1);
            if (fname) dataObj.firstName = fname;
            if (lname) dataObj.lastName = lname;
            if (address) dataObj.address = address;
            if (password) dataObj.password = password;

            fileUpdate("users", phone, dataObj, (err2, data2) => {
              if (!err2 && data2) {
                callback(200, {
                  firstName: fname,
                  lastName: lname,
                  address,
                  phone,
                });
              } else {
                callback(404, { Error: "Internal server error" });
              }
            });
          } else {
            callback(400, { Error: "Internal server error" });
          }
        });
      } else callback(400, { Error: "Invalid Auth token" });
    });
  } else callback(400, { Error: "Please send proper request" });
};

// delete existing data
handler.user.delete = (reqProperty, callback) => {
  let { phone } = reqProperty.reqQuery;
  let { token } = reqProperty.reqHeader;
  phone = typeof phone === "string" && phone.length === 11 ? phone : false;
  token = typeof token === "string" && token.length === 20 ? token : false;

  if (phone && token) {
    tokenVerify(phone, token, (isValidToken) => {
      if (isValidToken) {
        fileRead("users", phone, (err1, data1) => {
          if (!err1 && data1) {
            fileDelete("users", phone, (err2) => {
              if (err2) callback(400, { Error: "Internal server error" });
              else callback(200, { result: "seccessfully delete the file" });
            });
          } else callback(400, { Error: "Internal server error" });
        });
      } else callback(400, { Error: "Invalide auth token" });
    });
  } else {
    callback(400, { Error: "Internal error on server" });
  }
};

module.exports = handler;
