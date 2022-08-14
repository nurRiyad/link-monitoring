const { samplehandler } = require("./handlers/routeHandlers/sampleHandlers");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");

const routes = {
  sample: samplehandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
