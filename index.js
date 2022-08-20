const { initServer } = require("./lib/server");
const { initWorker } = require("./lib/worker");

// Module Scaffolding
const app = {};

// Run the project
app.initProject = () => {
  initServer();
  initWorker();
};

// run the project
app.initProject();

// return app
module.exports = app;
