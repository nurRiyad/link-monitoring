const handler = {};

handler.samplehandler = (reqProperty, callback) => {
  console.log(reqProperty);
  console.log("This is called from sample handler");
  callback(200, { msg: "sample riyad" });
};

module.exports = handler;
