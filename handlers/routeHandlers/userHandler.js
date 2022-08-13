const {
  read: fileRead,
  create: fileCreate,
  update: fileUpdate,
  delete: fileDelete,
} = require("../../lib/data");
const { hasing, parseJSON } = require("../../helper/utility");

const handler = {};

handler.userHandler = (reqProperty, callback) => {
  const valideReqType = ["get", "put", "post", "delete"];
  if (valideReqType.includes(reqProperty.reqMethod)) {
    handler.user[reqProperty.reqMethod](reqProperty, callback);
  } else {
    callback(400, "Request Type is not valid");
  }
};

handler.user = {};

// get user data
handler.user.get = (reqProperty, callback) => {
  let { phone } = reqProperty.reqQuery;
  phone = typeof phone === "string" && phone.length === 11 ? phone : false;
  if (phone) {
    fileRead("users", phone, (err1, data) => {
      if (!err1 && data) {
        const dataObj = parseJSON(data);
        if (dataObj.password) delete dataObj.password;
        callback(200, dataObj);
      } else callback(404, { error: "Internal server error" });
    });
  } else {
    callback(400, { error: "Internal server errors" });
  }
};

// create new user
handler.user.post = (reqProperty, callback) => {
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
          if (err2) callback(500, "Internal Server Error");
          else
            callback(200, {
              firstName: body.firstName,
              lastName: body.lastName,
              address: body.address,
              phone: body.phone,
            });
        });
      } else {
        callback(500, "Error From server side already user exist");
      }
    });
  } else {
    callback(400, { error: "Please enter proper body for the request" });
  }
};

// update user data
handler.user.put = (reqProperty, callback) => {
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

  if (fname || lname || address || password) {
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
            callback(404, { error: "Internal server error" });
          }
        });
      } else {
        callback(400, { error: "Internal server error" });
      }
    });
  }
};

// delete existing data
handler.user.delete = (reqProperty, callback) => {
  let { phone } = reqProperty.reqQuery;
  phone = typeof phone === "string" && phone.length === 11 ? phone : false;
  if (phone) {
    fileRead("users", phone, (err1, data1) => {
      if (!err1 && data1) {
        fileDelete("users", phone, (err2) => {
          if (err2) callback(400, { error: "Internal server error" });
          else callback(200, { result: "seccessfully delete the file" });
        });
      }
    });
  } else callback(400, { error: "Internal error on server" });
};

module.exports = handler;
