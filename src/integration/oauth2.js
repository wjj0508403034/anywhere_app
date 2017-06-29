'use strict';

const Anywhere = require("./anywhere");
const ErrorCodes = require("./../errors/error-codes");
const Token = require("./token");
const RestClient = require("./../rest-client/rest-client");
const OP_Install = "install";

const Default_Headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function getToken(payload) {
  return RestClient.post(Anywhere.Config.tokenUrl(), payload, Default_Headers).then(function(data) {
    if (data["error"]) {
      return Promise.reject(data);
    }
    return Promise.resolve(new Token(data));
  }).catch(function(err) {
    return Promise.reject(err);
  });
}

function getTokenByCode(req, res, next, redirect_uri) {
  let code = req.query.code;
  if (!code) {
    next(ErrorCodes.Params_Invalid);
    return;
  }

  let payload = {
    client_id: Anywhere.Config.clientId,
    client_secret: Anywhere.Config.clientSecret,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect_uri
  };

  getToken(payload).then(function(token) {
    Anywhere.Config.setToken(token);
    res.redirect("/");
  }).catch(function(err) {
    next(err);
  });
}

module.exports = {

  routes: function(app) {

    /**
     * App Installation URL
     */
    app.get(`${Anywhere.RoutePrefix}/install`, Anywhere.verify, function(req, res, next) {
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


    /**
     * App Application URL
     */
    app.get(`${Anywhere.RoutePrefix}`, Anywhere.verify, function(req, res, next) {
      if (!req.verify_signature) {
        res.redirect(Anywhere.Config.authorizeUrl(Anywhere.Config.applicationUrl));
        return;
      }

      getTokenByCode(req, res, next, Anywhere.Config.applicationUrl);
    });
  },

  getTokenByRefreshToken: function(refreshToken, redirect_uri) {
    return getToken({
      client_id: Anywhere.Config.clientId,
      client_secret: Anywhere.Config.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: redirect_uri
    });
  }
};