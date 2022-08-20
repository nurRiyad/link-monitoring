const fs = require("fs");
const path = require("path");

const app = {};

// set base dir
app.baseURL = path.join(__dirname, "../.data/");

// create operation
app.create = (dir, filename, data, callback) => {
  const url = `${app.baseURL + dir}/${filename}.json`;
  fs.open(url, "wx", (err1, fileDes) => {
    if (!err1 && fileDes) {
      const strData = JSON.stringify(data);
      fs.writeFile(fileDes, strData, (err2) => {
        if (!err2) {
          fs.close(fileDes, (err3) => {
            if (!err3) {
              callback("", "Successfully Write the file");
            } else {
              callback("Eroor cannot close the file");
            }
          });
        } else {
          callback("Error Cannot write in file");
        }
      });
    } else {
      callback("Sorry couldn't open the file");
    }
  });
};

// Read operationg
app.read = (dir, filename, callback) => {
  const url = `${app.baseURL + dir}/${filename}.json`;
  fs.readFile(url, "utf8", (err1, data) => {
    callback(err1, data);
  });
};

// Update file
app.update = (dir, filename, data, callback) => {
  const url = `${app.baseURL + dir}/${filename}.json`;
  fs.open(url, "r+", (err1, fileDes) => {
    if (!err1 && fileDes) {
      const strData = JSON.stringify(data);
      fs.ftruncate(fileDes, (err2) => {
        if (err2) {
          callback("Can't trancat thek file");
        } else {
          fs.writeFile(fileDes, strData, (err3) => {
            if (err3) {
              callback("Can't wirte in the file");
            } else {
              fs.close(fileDes, (err4) => {
                if (err4) {
                  callback("Can't close the file");
                } else {
                  callback("", "Successfully update the file");
                }
              });
            }
          });
        }
      });
    } else {
      callback("Error cannot open the file");
    }
  });
};

// Delete file
app.delete = (dir, filename, callback) => {
  const url = `${app.baseURL + dir}/${filename}.json`;
  fs.unlink(url, (err) => {
    if (err) callback("Can't delete the file");
    else callback("", "Susseccfully delete the file");
  });
};

app.readDir = (dir, callback) => {
  const url = `${app.baseURL + dir}`;
  fs.readdir(url, (err1, data1) => {
    if (!err1 && data1) {
      const lists = [];
      data1.forEach((data) => {
        const newData = data.replace(".json", "");
        lists.push(newData);
      });
      callback("", lists);
    } else {
      callback(err1, "");
    }
  });
};

module.exports = app;
