const {
  read: fileRead,
  create: fileCreate,
  update: fileUpdate,
  delete: fileDelete,
} = require("../../lib/data");
const { parseJSON, tokenVerify, createToken } = require("../../helper/utility");

// app scaffolding
const handler = {};

// Only allow the selected request to pass with /check route
handler.checkHandler = (reqProperty, callback) => {
  const valideReqType = ["get", "put", "post", "delete"];
  if (valideReqType.includes(reqProperty.reqMethod)) {
    handler.check[reqProperty.reqMethod](reqProperty, callback);
  } else {
    callback(400, { Error: "This type of request not allowed" });
  }
};

handler.check = {};

// create new check
handler.check.post = (reqProperty, callback) => {
  const body = reqProperty.reqBody;
  let { token } = reqProperty.reqHeader;
  token = typeof token === "string" && token.length === 20 ? token : false;

  const protocol =
    typeof body.protocol === "string" &&
    ["http", "https"].includes(body.protocol)
      ? body.protocol
      : false;
  const method =
    typeof body.method === "string" &&
    ["get", "post", "put", "delete"].includes(body.method.toLowerCase())
      ? body.method
      : false;
  const url =
    typeof body.url === "string" && body.url.trim().length > 1
      ? body.url
      : false;
  const successcode =
    typeof body.successcode === "object" &&
    body.successcode instanceof Array &&
    body.successcode.length > 0
      ? body.successcode
      : false;
  const timeout =
    typeof body.timeout === "number" && body.timeout % 1 === 0
      ? body.timeout
      : false;

  if (protocol && method && url && successcode && timeout) {
    if (token) {
      // read the token and get the phone
      fileRead("tokens", token, (err1, data1) => {
        if (!err1 && data1) {
          const dataObj = parseJSON(data1);
          const { phone } = dataObj;
          // useing phone read the user to ensure it exist
          fileRead("users", phone, (err2, data2) => {
            if (!err2 && data2) {
              // token varify for expire time & other
              tokenVerify(phone, token, (isValidToken) => {
                if (isValidToken) {
                  const userObj = parseJSON(data2);
                  let userCheck = userObj.checks;
                  userCheck =
                    typeof userCheck === "object" && userCheck instanceof Array
                      ? userCheck
                      : [];
                  // check how limit of check we added
                  if (userCheck.length >= 5) {
                    callback(400, { Error: "Check max limit crossed" });
                  } else {
                    const checkId = createToken(18);
                    const checkobj = {
                      id: checkId,
                      protocol,
                      method,
                      url,
                      timeout,
                      successcode,
                    };
                    // if token varify then create a check file with data in check dir
                    fileCreate("checks", checkId, checkobj, (err3, data3) => {
                      if (!err3 && data3) {
                        userCheck.push(checkId);
                        userObj.checks = userCheck;
                        // if check file created update the user checks array with this id
                        fileUpdate("users", phone, userObj, (err4, data4) => {
                          if (!err4 && data4) callback(200, userObj);
                          else
                            callback(400, { Error: "Internal server error" });
                        });
                      } else callback(400, { Eoor: "Internal Server error" });
                    });
                  }
                } else callback(400, { Eoor: "Invalid auth token" });
              });
            } else callback(400, { Eoor: "Internal server error" });
          });
        } else callback(400, { Eoor: "Internal server problem" });
      });
    } else callback(400, { Eoor: "You have problem in your request body" });
  } else callback(400, { Eoor: "You have problem in your request body" });
};

// get check data
handler.check.get = (reqProperty, callback) => {
  let { id } = reqProperty.reqQuery;
  let { token } = reqProperty.reqHeader;
  token = typeof token === "string" && token.length === 20 ? token : false;
  id = typeof id === "string" && id.length === 18 ? id : false;

  if (id && token) {
    fileRead("tokens", token, (err1, data1) => {
      if (!err1 && data1) {
        const tokenObj = parseJSON(data1);
        const { phone } = tokenObj;
        fileRead("users", phone, (err2, data2) => {
          if (!err2 && data2) {
            tokenVerify(phone, token, (isValidToken) => {
              if (isValidToken) {
                fileRead("checks", id, (err3, data3) => {
                  if (!err3 && data3) {
                    const checkObj = parseJSON(data3);
                    callback(200, checkObj);
                  } else callback(400, { Error: "Internal server error" });
                });
              } else callback(400, { Error: "Invalid auth token" });
            });
          } else callback(400, { Error: "Internal server error" });
        });
      } else callback(400, { Error: "Internal server error" });
    });
  } else callback(400, { Error: "Internal server error" });
};

// update user data
handler.check.put = (reqProperty, callback) => {
  const body = reqProperty.reqBody;
  let { token } = reqProperty.reqHeader;
  token = typeof token === "string" && token.length === 20 ? token : false;

  const id =
    typeof body.id === "string" && body.id.length === 18 ? body.id : false;
  const protocol =
    typeof body.protocol === "string" &&
    ["http", "https"].includes(body.protocol)
      ? body.protocol
      : false;
  const method =
    typeof body.method === "string" &&
    ["get", "post", "put", "delete"].includes(body.method.toLowerCase())
      ? body.method
      : false;
  const url =
    typeof body.url === "string" && body.url.trim().length > 1
      ? body.url
      : false;
  const successcode =
    typeof body.successcode === "object" &&
    body.successcode instanceof Array &&
    body.successcode.length > 0
      ? body.successcode
      : false;
  const timeout =
    typeof body.timeout === "number" && body.timeout % 1 === 0
      ? body.timeout
      : false;
  if (id && (protocol || method || url || successcode || timeout)) {
    if (token) {
      // read the token and get the phone
      fileRead("tokens", token, (err1, data1) => {
        if (!err1 && data1) {
          const dataObj = parseJSON(data1);
          const { phone } = dataObj;
          // useing phone read the user to ensure it exist
          fileRead("users", phone, (err2, data2) => {
            if (!err2 && data2) {
              // token varify for expire time & other
              tokenVerify(phone, token, (isValidToken) => {
                if (isValidToken) {
                  fileRead("checks", id, (err3, data3) => {
                    if (!err3 && data3) {
                      const checkObj = parseJSON(data3);
                      if (protocol) checkObj.protocol = protocol;
                      if (method) checkObj.method = method;
                      if (url) checkObj.url = url;
                      if (successcode) checkObj.successcode = successcode;
                      if (timeout) checkObj.timeout = timeout;

                      fileUpdate("checks", id, checkObj, (err4, data4) => {
                        if (!err4 && data4) {
                          callback(200, {
                            Result: "File Successfully updated",
                          });
                        } else
                          callback(400, { Error: "Internal server error" });
                      });
                    } else callback(400, { Error: "Internal Server Error" });
                  });
                } else callback(400, { Eoor: "Invalid auth token" });
              });
            } else callback(400, { Eoor: "Internal server error" });
          });
        } else callback(400, { Eoor: "Internal server problem" });
      });
    } else callback(400, { Eoor: "You have problem in your request body" });
  } else callback(400, { Eoor: "You have problem in your request body" });
};

// delete existing data
handler.check.delete = (reqProperty, callback) => {
  let { id } = reqProperty.reqQuery;
  let { token } = reqProperty.reqHeader;
  token = typeof token === "string" && token.length === 20 ? token : false;
  id = typeof id === "string" && id.length === 18 ? id : false;

  if (id && token) {
    // read the token and get the user phone id
    fileRead("tokens", token, (err1, data1) => {
      if (!err1 && data1) {
        const tokenObj = parseJSON(data1);
        const { phone } = tokenObj;
        // how find the user with the phone
        fileRead("users", phone, (err2, data2) => {
          if (!err2 && data2) {
            // check if the token is valid or expire
            tokenVerify(phone, token, (isValidToken) => {
              if (isValidToken) {
                // delete the check from the checks file
                fileDelete("checks", id, (err3, data3) => {
                  if (!err3 && data3) {
                    const userObj = parseJSON(data2);
                    const { checks } = userObj;
                    const checkIndex = checks.indexOf(id);
                    if (checkIndex >= 0) {
                      // remove the check from the user array
                      checks.splice(checkIndex, 1);
                      userObj.checks = checks;
                      // now update the user
                      fileUpdate("users", phone, userObj, (err4, data4) => {
                        if (!err4 && data4) {
                          callback(200, {
                            Result: "Successfully deleted the check",
                          });
                        } else
                          callback(400, { Error: "Internal server error" });
                      });
                    } else
                      callback(400, {
                        Error: "Try to remove check from user but not found",
                      });
                  } else callback(400, { Error: "Internal server error" });
                });
              } else callback(400, { Error: "Invalid auth token" });
            });
          } else callback(400, { Error: "Internal server error" });
        });
      } else callback(400, { Error: "Internal server error" });
    });
  } else callback(400, { Error: "Internal server error" });
};

module.exports = handler;
