const { samplehandler } = require("./handlers/routeHandlers/sampleHandlers");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler.js");

const routes = {
  sample: samplehandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
