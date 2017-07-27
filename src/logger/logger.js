'use strict';

const LoggerFactory = require('request-log4js');

LoggerFactory.configure({
  level: "DEBUG"
});

module.exports = LoggerFactory;