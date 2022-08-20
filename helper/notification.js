const https = require("https");
const querystring = require("querystring");
const { twilio } = require("./enviroment");

const notification = {};

notification.sendMsg = (phone, msg, callback) => {
  const Phone =
    typeof phone === "string" && phone.length === 11 ? phone : false;
  const Msg = typeof msg === "string" && msg.trim().length > 0 ? msg : false;

  if (Phone && Msg) {
    const payLoad = {
      From: twilio.fromPhone,
      To: "+8801730238191",
      Body: Msg,
    };

    const stringifyPayload = querystring.stringify(payLoad);

    const reqDetailsObj = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const req = https.request(reqDetailsObj, (res) => {
      const { statusCode } = res;
      if (statusCode === 200 || statusCode === 201) {
        callback(false);
      } else
        callback({
          Error: `message not properly send status code ${statusCode}`,
        });
    });

    req.write(stringifyPayload);
    req.end();

    req.on("error", (err) => {
      callback({ Error: err });
    });
  } else callback({ Error: "Send valid phone and msg" }, "");
};

module.exports = notification;
