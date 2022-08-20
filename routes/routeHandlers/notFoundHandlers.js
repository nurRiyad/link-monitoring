const handler = {};

handler.notFoundHandler = (reqProperty, callback) => {
  callback(404, { msg: "not found" });
};

module.exports = handler;
