const { userHandler } = require("./routeHandlers/userHandler");
const { tokenHandler } = require("./routeHandlers/tokenHandler");
const { checkHandler } = require("./routeHandlers/checkHandler");

const routes = {
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
