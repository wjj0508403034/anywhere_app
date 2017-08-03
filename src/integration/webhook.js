'use strict';

const Anywhere = require("./anywhere");
const Api = require("./api");
const Error = require("./../errors/error");
const AppConfig = require("./../config/app-config");
const Logger = require("./../logger/logger").getLogger("webhook");

const WebhookNames = ["LOGIN",
  "APP_UNINSTALL",
  "Product/CREATE",
  "Product/UPDATE",
  "Product/DELETE",
  "SKU/CREATE",
  "SKU/UPDATE"
];

function MessageCollection(eventType) {
  this.eventType = eventType;
  this.datas = [];
}

MessageCollection.prototype.add = function(params) {
  this.datas.add({
    date: new Date(),
    params: params
  });
  this.count = this.datas.length;
};


const MessageCache = {};

WebhookNames.forEach(function(webhookName) {
  MessageCache[webhookName] = new MessageCollection(webhookName);
});


function VerifySignature(req, res, next) {
  if (!req.body) {
    next(Error.new(Error.ErrorCodes.Params_Invalid));
    return;
  }

  let hmac = req.body.hmac;
  let timestamp = req.body.timestamp;

  if (!Anywhere.verifySignature(hmac, timestamp)) {
    next(Error.new(Error.ErrorCodes.SAP_Verify_Signature_Failed));
    return;
  }

  next();
}

module.exports = {
  verify: VerifySignature,

  routes: function(app) {

    app.post(`${Anywhere.RoutePrefix}/install`, VerifySignature, function(req, res, next) {
      Logger.info(req, "Received app uninstall message.\n", req.body);
    });

    app.post(`${Anywhere.RoutePrefix}/webhooks`, VerifySignature, function(req, res, next) {
      Logger.info(req, "Received webhook message.\n", req.body);
      if (req.body && req.body.payload) {
        if (WebhookNames.indexOf(req.body.payload.event_type) === -1) {
          next("Unkown webhook name");
          return;
        }

        MessageCache[req.body.payload.event_type].add(req.body.payload);
        res.end();
        return;
      }

      next(Error.new(Error.ErrorCodes.Params_Invalid));
    });

    app.get(`${Anywhere.RoutePrefix}/webhooks`, function(req, res, next) {
      res.json(MessageCache);
    });

    app.post(`${Anywhere.RoutePrefix}/webhooks/register`, function(req, res, next) {
      if (req.body && req.body.eventType) {
        if (WebhookNames.indexOf(req.body.eventType) === -1) {
          next("Unkown webhook name");
          return;
        }

        Api.post("Webhooks", {
          callbackUrl: `http://${AppConfig.Domain}/anywhere/webhooks`,
          eventType: req.body.eventType
        }).then(function(data) {
          res.json({
            msg: `Register webhook(${req.body.eventType}) successfully`
          });
        }).catch(function(err) {
          next(err);
        });
        return;
      }

      next(Error.new(Error.ErrorCodes.Params_Invalid));
    });
  }


};