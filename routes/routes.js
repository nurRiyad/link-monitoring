const { userHandler } = require("./routeHandlers/userHandler");
const { tokenHandler } = require("./routeHandlers/tokenHandler");
const { checkHandler } = require("./routeHandlers/checkHandler");
const { singupHandler } = require("./routeHandlers/signupHandler");
const { singinHandler } = require("./routeHandlers/singinHandler");

const routes = {
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
  signup: singupHandler,
  signin: singinHandler,
};

module.exports = routes;
