const enviroment = {};

enviroment.staging = {
  port: 3000,
  envName: "staging",
  key: "riyad",
};

enviroment.production = {
  port: 5000,
  envName: "production",
  key: "riyad1",
};

const currentEnviroment =
  typeof process.env.ENV_NODE === "string" ? process.env.ENV_NODE : "staging";

const enviromentToExport =
  typeof enviroment[currentEnviroment] === "object"
    ? enviroment[currentEnviroment]
    : enviroment.staging;

module.exports = enviromentToExport;
