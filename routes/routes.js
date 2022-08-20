const { userHandler } = require("./routeHandlers/userHandler");
const { checkHandler } = require("./routeHandlers/checkHandler");
const { singupHandler } = require("./routeHandlers/signupHandler");
const { singinHandler } = require("./routeHandlers/singinHandler");
const { signoutHandler } = require("./routeHandlers/signoutHandler");

const routes = {
  user: userHandler,
  check: checkHandler,
  signup: singupHandler,
  signin: singinHandler,
  signout: signoutHandler,
};

module.exports = routes;
