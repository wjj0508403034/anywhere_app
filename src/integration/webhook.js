'use strict';

const Anywhere = require("./anywhere");
const ErrorCodes = require("./../errors/error-codes");

module.exports = {

  verify: function(req, res, next) {
    if (!req.body) {
      next(ErrorCodes.Params_Invalid);
      return;
    }

    let hmac = req.body.hmac;
    let timestamp = req.body.timestamp;

    if (!Anywhere.verifySignature(hmac, timestamp)) {
      next(ErrorCodes.SAP_Verify_Signature_Failed);
      return;
    }

    next();
  }
};