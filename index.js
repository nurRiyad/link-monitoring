const http = require("http");

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
app.handleReqRes = (req, res) => {
  res.end("Hello world");
};

// Run the server
app.createServer();
