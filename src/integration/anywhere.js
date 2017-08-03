'use strict';

const AppConfig = require("./../config/app-config");
const Signature = require("./signature");
const Error = require("./../errors/error");
const AnywhereConfig = require("./config");

const anywhereConfig = new AnywhereConfig({
  clientId: "3jQKDjeWYP2c0IdS3OgQd8qxpKjqORbd",
  clientSecret: "5GyrBhXIdxPGGp7z3jtkkhm083IJZ4sl",
  domain_anywhere: "go-mv.dd.smec.sap.corp",
  domain_openapi: "api-mv.dd.smec.sap.corp",
  installUrl: `http://${AppConfig.Domain}/anywhere/install`,
  applicationUrl: `http://${AppConfig.Domain}/anywhere`
});


function verifyAnywhereSignature(hmac, timestamp) {
  return new Signature(anywhereConfig.clientId, anywhereConfig.clientSecret, timestamp).equals(hmac);
}

module.exports = {
  RoutePrefix: "/anywhere",
  Config: anywhereConfig,
  verify: function(req, res, next) {
    if (req.query && req.query.hmac && req.query.timestamp) {
      if (!verifyAnywhereSignature(req.query.hmac, req.query.timestamp)) {
        next(Error.new(Error.ErrorCodes.SAP_Verify_Signature_Failed));
        return;
      }

      req.verify_signature = true;
    }
    next();
  },
  verifySignature: verifyAnywhereSignature
};