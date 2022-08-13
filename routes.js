const { samplehandler } = require("./handlers/routeHandlers/sampleHandlers");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
  sample: samplehandler,
  user: userHandler,
};

module.exports = routes;
