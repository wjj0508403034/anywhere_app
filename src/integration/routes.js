'use strict';

const Anywhere = require("./anywhere");
const Error = require("./../errors/error");
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

  app.patch(`${Anywhere.RoutePrefix}/config`, function(req, res, next) {
    if (req.body) {
      ["clientId", "clientSecret", "anywhereDomain", "openApiDomain", "installUrl", "applicationUrl"].forEach(
        function(name) {
          if (req.body[name]) {
            Anywhere.Config[name] = req.body[name];
          }
        });

      res.json({
        msg: "Update config successfully."
      });

      return;
    }

    next(Error.new(Error.ErrorCodes.Params_Invalid));

  });
};