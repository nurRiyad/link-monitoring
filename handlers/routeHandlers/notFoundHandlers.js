const handler = {};

handler.notFoundHandler = (reqProperty, callback) => {
  console.log(reqProperty);
  console.log("This is called from not found handler");
  callback(200, { msg: "not found" });
};

module.exports = handler;
