const enviroment = {};

enviroment.staging = {
  port: 3000,
  envName: "staging",
  key: "riyad",
  twilio: {
    fromPhone: "+17179128176",
    accountSid: "ACe5c891c2f092ba8401e36299de6d9dc6",
    authToken: "d5f54e254ad0a556438eac8dd86dd901",
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
