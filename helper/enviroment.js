const enviroment = {};

enviroment.staging = {
  port: 3000,
  envName: "staging",
  key: "riyad",
  twilio: {
    fromPhone: "+17179128176",
    accountSid: "Your twilio sid",
    authToken: "Your twilio auth token",
  },
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
