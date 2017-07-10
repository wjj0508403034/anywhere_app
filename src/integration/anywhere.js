'use strict';

const AppConfig = require("./../config/app-config");
const Signature = require("./signature");
const Error = require("./../errors/error");
const AnywhereConfig = require("./config");

const anywhereConfig = new AnywhereConfig({
  clientId: "hD3AHd7NMCS91a4DcU6eYeqBk10ujFZp",
  clientSecret: "-cX1K3juCnl0AuXXmywHaMR2t158drCS",
  domain_anywhere: "go-mv.bb.smec.sap.corp",
  domain_openapi: "api-mv.bb.smec.sap.corp",
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