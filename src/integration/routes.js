'use strict';

const AppConfig = require("./../config/app-config");
const Anywhere = require("./anywhere");
const ErrorCodes = require("./../errors/error-codes");

module.exports = function(app) {

  app.get("/anywhere/install", function(req, res, next) {
    if (!req.query) {
      next(ErrorCodes.Params_Invalid);
      return;
    }

    let timestamp = req.query.timestamp;
    let hmac = req.query.hmac;
    if (!Anywhere.verifySignature(hmac, timestamp)) {
      next(ErrorCodes.SAP_Verify_Signature_Failed);
      return;
    }

    let op = req.query.op;
    if (op === "install") {
      res.redirect(Anywhere.InstallUrl);
      return;
    }

    let code = req.query.code;
    if (!code) {
      next(ErrorCodes.Params_Invalid);
      return;
    }

    Anywhere.getTokenByCode(code)
      .then(function(token) {
        Anywhere.OAuth2Token = token;
        res.redirect("/");
      }).catch(function(err) {
        next(err);
      });


  });

  app.get("/anywhere", function(req, res, next) {
    res.redirect(Anywhere.InstallUrl);
  });

  app.get("/anywhere/token", function(req, res, next) {
    res.json(Anywhere.OAuth2Token);
  });


};