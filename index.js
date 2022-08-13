const http = require("http");
const { reqResHandler } = require("./helper/handleReqRes");

// Module Scaffolding
const app = {};

// Configaretion
app.config = {
  port: 3000,
};

// Create Server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(app.config.port, () => {
    console.log(`Listening to port ${app.config.port}`);
  });
};

// Handle Req and Res
app.handleReqRes = reqResHandler;

// Run the server
app.createServer();
