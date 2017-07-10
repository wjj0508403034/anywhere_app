'use strict';

const log4js = require('log4js');
const Logger = require("./logger");
const LoggerLayout = require("./logger-layout");
const os = require('os');
const fs = require('fs');
const logFileName = `anywhere-app.log`;

/**
 * Set Log folder
 */
const DefaultLogFolder = "/opt/sap/log/anywhere-app/";
var logFolder = process.env.LOG_PATH || DefaultLogFolder;

if (os.platform() === "win32") {
  logFolder = "c://anywhere-app-log//";
}

const folderExists = fs.existsSync(logFolder);
if (!folderExists) {
  fs.mkdirSync(logFolder);
}


const logFileFullPath = `${logFolder}${logFileName}`;

/**
 * log4js configuration
 */
const config = {
  "levels": {
    "[all]": "INFO"
  },
  "appenders": [{
    "type": "console",
    "layout": LoggerLayout
  }, {
    "type": "dateFile",
    "filename": logFileFullPath,
    "pattern": "-yyyy-MM-dd",
    "alwaysIncludePattern": false,
    "compress": true,
    "layout": LoggerLayout
  }]
};

log4js.configure(config);

module.exports = {
  getLogger: function(req, loggerName) {
    var logger = log4js.getLogger(loggerName);
    if (!logger.requestLogger) {
      logger.requestLogger = new Logger(logger);
    }

    return logger.requestLogger;
  }
};