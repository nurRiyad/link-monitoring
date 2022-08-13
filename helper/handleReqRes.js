const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandlers");

// App scaffolding
const app = {};

// handler function
app.reqResHandler = (req, res) => {
  const urlObject = url.parse(req.url, true);
  const rowRouteName = urlObject.pathname;
  const routeName = app.trimRoute(rowRouteName);
  const reqQuery = urlObject.query;
  const reqMethod = req.method.toLowerCase();
  const reqHeader = req.headers;

  const reqProperty = { routeName, reqQuery, reqMethod, reqHeader };

  const selectedHandler = routes[routeName]
    ? routes[routeName]
    : notFoundHandler;

  selectedHandler(reqProperty, (statusCode, payload) => {
    if (typeof statusCode !== "number") statusCode = 500;
    if (typeof payload !== "object") payload = {};

    const payloadStr = JSON.stringify(payload);

    res.writeHead(statusCode);
    res.end(payloadStr);
  });

  let payload = "";
  const decoder = new StringDecoder("utf-8");

  req.on("data", (buffer) => {
    payload += decoder.write(buffer);
  });

  req.on("end", () => {
    payload += decoder.end();
    console.log(payload);
  });
};

// remove / from end and start of the route name
app.trimRoute = (route) => {
  let newRoute = route;
  for (let i = 0; i < newRoute.length; i += 1) {
    if (newRoute[i] === " " || newRoute[i] === "/")
      newRoute = newRoute.slice(1);
    else break;
  }
  for (let i = newRoute.length - 1; i >= 0; i -= 1) {
    if (newRoute[i] === " " || newRoute[i] === "/")
      newRoute = newRoute.slice(0, newRoute.length - 1);
    else break;
  }
  return newRoute;
};

// return module
module.exports = app;
