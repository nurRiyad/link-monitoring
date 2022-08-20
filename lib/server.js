const http = require("http");
const { reqResHandler } = require("../helper/handleReqRes");
const enviroment = require("../helper/enviroment");

// Module Scaffolding
const app = {};

// Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(enviroment.port, () => {
    console.log(`Listening to port ${enviroment.port}`);
  });
};

// Handle Req and Res
app.handleReqRes = reqResHandler;

app.initServer = () => {
  // Run the server
  app.createServer();
};

module.exports = app;
