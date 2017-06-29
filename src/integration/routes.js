'use strict';

const Anywhere = require("./anywhere");
const ErrorCodes = require("./../errors/error-codes");
const Webhook = require("./webhook");
const OAuth2 = require("./oauth2");
const Api = require("./api");
const AppLink = require("./app-link");

module.exports = function(app) {

  OAuth2.routes(app);
  Webhook.routes(app);
  AppLink.routes(app);

  app.get(`${Anywhere.RoutePrefix}/config`, function(req, res, next) {
    res.json(Anywhere.Config);
  });

  app.get(`${Anywhere.RoutePrefix}/api/:boName`, function(req, res, next) {
    Api.query(req.params.boName)
      .then(function(data) {
        res.json(data);
      }).catch(function(err) {
        next(err);
      });
  });
};