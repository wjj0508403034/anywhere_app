'use strict';

const Logger = require("./../logger/logger").getLogger("rest-client");
const RestClient = require("huoyun-restclient");


let RestClientLogger = {
  debug: function(args) {
    Logger.debug(null, args);
  },
  info: function(args) {
    Logger.info(null, args);
  },
  warn: function(args) {
    Logger.warn(null, args);
  },
  error: function(args) {
    Logger.error(null, args);
  }
};

RestClient.configure({
  logger: RestClientLogger
});

module.exports = RestClient;