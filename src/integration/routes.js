'use strict';

const Anywhere = require("./anywhere");
const ErrorCodes = require("./../errors/error-codes");
const Webhook = require("./webhook");
const Api = require("./api");
const OP_Install = "install";
const Route_Prefix = "/anywhere";


function getTokenByCode(req, res, next, redirect_uri) {
  let code = req.query.code;
  if (!code) {
    next(ErrorCodes.Params_Invalid);
    return;
  }

  Anywhere.getTokenByCode(code, redirect_uri)
    .then(function(token) {
      Anywhere.Config.setToken(token);
      res.redirect("/");
    }).catch(function(err) {
      next(err);
    });
}

module.exports = function(app) {

  app.get(`${Route_Prefix}/install`, Anywhere.verify, function(req, res, next) {
    if (!req.query) {
      next(ErrorCodes.Params_Invalid);
      return;
    }

    let op = req.query.op;
    if (op === OP_Install) {
      res.redirect(Anywhere.Config.authorizeUrl(Anywhere.Config.installUrl));
      return;
    }

    getTokenByCode(req, res, next, Anywhere.Config.installUrl);
  });

  app.post(`${Route_Prefix}/install`, Webhook.verify, function(req, res, next) {
    next();
  });

  app.get(`${Route_Prefix}`, Anywhere.verify, function(req, res, next) {
    if (!req.verify_signature) {
      res.redirect(Anywhere.Config.authorizeUrl(Anywhere.Config.applicationUrl));
      return;
    }

    getTokenByCode(req, res, next, Anywhere.Config.applicationUrl);
  });

  app.get(`${Route_Prefix}/config`, function(req, res, next) {
    res.json(Anywhere.Config);
  });

  app.get(`${Route_Prefix}/me`, function(req, res, next) {
    Anywhere.api("Users/me")
      .then(function(data) {
        res.json(data);
      }).catch(function(err) {
        next(err);
      });
  });

  app.get(`${Route_Prefix}/api/:boName`, function(req, res, next) {
    Api.query(req.params.boName)
      .then(function(data) {
        res.json(data);
      }).catch(function(err) {
        next(err);
      });
  });


};