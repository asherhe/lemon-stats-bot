const fs = require("fs");

function timestamp(date = new Date()) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `[${year}-${month}-${day} ${hour}:${minute}:${second}]`;
}

function log(color, level, message) {
  var output = `${color}${timestamp()} ${level}: ${message}`;
  console.log(output);
  writeToFile(output.replace(/\x1b\[.*?m/g, "") + "\n");
}

function writeToFile(text) {
  fs.writeFile("./log.txt", text, { flag: "a+" }, (error) => {
    if (error) console.log(error);
  });
}

writeToFile(`-------- Start on ${timestamp().slice(1, -1)} --------\n`);

/*
 * TRACE - extremely fine logging
 * DEBUG - for debugging purposes
 * INFO - for general information
 * WARN - when something unexpected happens
 * ERROR - when something goes wrong
 * FATAL - when something really bad happens
 */

module.exports = {
  trace: function (message) {
    log("\x1b[2m", "TRACE\x1b[0m", message);
  },
  debug: function (message) {
    log("\x1b[2m", "\x1b[0;32mDEBUG\x1b[0m", message);
  },
  info: function (message) {
    log("\x1b[2m", "\x1b[0;36mINFO\x1b[0m", message);
  },
  warn: function (message) {
    log("\x1b[0m", "\x1b[33mWARN\x1b[0m", message);
  },
  error: function (message) {
    log("\x1b[1m", "\x1b[31mERROR\x1b[0m", message);
  },
  fatal: function (message) {
    log("\x1b[1;37;41m", "FATAL", `${message}\x1b[0m`);
  },
};
