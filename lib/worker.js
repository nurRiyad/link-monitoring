const url = require("url");
const http = require("http");
const https = require("https");
const { readDir, read: fileRead, update: fileUpdate } = require("./data");
const { parseJSON } = require("../helper/utility");
const { sendMsg } = require("../helper/notification");

// Module Scaffolding
const app = {};

// read a check object send a api request and return the status
const checkUrlStatus = (dataObj, callback) => {
  const successCode = dataObj.successcode || [];
  const parsedUrl = url.parse(`${dataObj.protocol}://${dataObj.url}`, true);

  const reqDetails = {
    protocol: `${dataObj.protocol}:`,
    hostname: parsedUrl.hostname,
    method: dataObj.method,
    path: parsedUrl.path,
    timeout: dataObj.timeout * 1000,
  };

  const selectedProtocol = dataObj.protocol === "http" ? http : https;

  let isStatusSend = false;

  const req = selectedProtocol.request(reqDetails, (res) => {
    const status = String(res.statusCode);
    if (successCode.includes(status)) {
      isStatusSend = true;
      callback("up");
    } else {
      isStatusSend = true;
      callback("down");
    }
  });

  req.on("error", () => {
    if (!isStatusSend) {
      isStatusSend = true;
      callback("down");
    }
  });

  req.on("timeout", () => {
    if (!isStatusSend) {
      isStatusSend = true;
      callback("down");
    }
  });

  req.end();
};

// get all the ulr from the checks director and check the status
const runUrlChecker = () => {
  readDir("checks", (err1, lists) => {
    if (!err1 && lists) {
      lists.forEach((list) => {
        fileRead("checks", list, (err2, data2) => {
          if (!err2 && data2) {
            const dataObj = parseJSON(data2);
            checkUrlStatus(dataObj, (newStatus) => {
              const oldStatus = dataObj.status || "";
              if (newStatus !== oldStatus) {
                dataObj.status = newStatus;
                fileUpdate("checks", dataObj.id, dataObj, (err3, data3) => {
                  if (!err3 && data3) {
                    console.log(
                      `Status changes for ${dataObj.url} -> ${newStatus}`
                    );
                    const msg = `Your site :${dataObj.url} is ${newStatus}`;
                    sendMsg(dataObj.phone, msg, (err4) => {
                      if (err4) console.log(err4);
                      else console.log("Properly send msg to the user");
                    });
                  } else {
                    console.log(
                      "Somethink worng happen coult check update new status"
                    );
                  }
                });
              }
            });
          } else console.log(err2);
        });
      });
    } else console.log(err1);
  });
};

// this functino run continusly and check the status for the url
const worker = () => {
  runUrlChecker();
  setInterval(() => {
    runUrlChecker();
  }, 10000);
};

app.initWorker = () => {
  // Run the workier
  worker();
};

module.exports = app;
